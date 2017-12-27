import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {NotNull} from '../../decorators/not-null';
import {Observable} from 'rxjs/Observable';
import {AssociatedResourceResolver} from '@hal-navigator/descriptor/association/associated-resource-resolver';
import {AssociatedResourceListener} from '@hal-navigator/descriptor/association/associated-resource-listener';
import {LOGGER} from '../../logging/logger';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {FormFieldFactoryBuilder} from '@hal-navigator/schema/form/form-field-factory-builder';

/**
 * Accepts a list of resource descriptors. Each request is forward to any item of this list.
 * The first defined is returned. {@link #resolveAssocations()} is a special function
 * to recursively go through all resources and properties,
 * and then searching for an appropriate {@link AssociatedResourceResolver} for finding the associated resource name and notifying all
 * {@link AssociatedResourceListener listeners} about the name, such that every descriptor can
 * {@link ResourceDescriptor#resolveAssociation() resolve its association to another resource, if there is any}.
 */
export class CombiningDescriptor implements ResourceDescriptor {
  constructor(private priorityList: Array<ResourceDescriptor>) {
    if (priorityList.length === 0) {
      throw new Error('Invalid descriptor: No descriptors to combine');
    }
  }

  @NotNull()
  getTitle(): string {
    return this.getFirstResult(d => d.getTitle());
  }

  @NotNull()
  getName(): string {
    return this.getFirstResult(d => d.getName());
  }

  toFormField(): FormField {
    const builder = new FormFieldFactoryBuilder();
    this.priorityList.reverse().forEach(d => builder.withResourceDescriptor(d));
    return builder.build().toFormField();
  }

  getChild(resourceName: string): ResourceDescriptor {
    return new CombiningDescriptor(this.priorityList
      .map(d => d.getChild(resourceName))
      .filter(d => d));
  }

  getChildren(): CombiningDescriptor[] {
    const childrenByName: { [name: string]: ResourceDescriptor[] } = this.priorityList
      .map(d => d.getChildren())
      .reduce((c1, c2) => c1.concat(c2), [])
      .reduce((children, child) => this.pushToArrayGivenByName(children, child), {});
    return Object.keys(childrenByName)
      .map(key => new CombiningDescriptor(childrenByName[key]));
  }

  resolveAssociation(): Observable<CombiningDescriptor> {
    const resolver = this.priorityList
      .map(d => d as any as AssociatedResourceResolver)
      .find(descriptor => !!descriptor.resolveAssociatedResourceName);
    if (resolver) {
      const resourceName = resolver.resolveAssociatedResourceName();
      LOGGER.trace(`Found associated resource resolver ${resolver.constructor.name} that returned ${resourceName}.`);
      this.priorityList
        .map(descriptor => descriptor as any as AssociatedResourceListener)
        .filter(descriptor => descriptor.notifyAssociatedResource)
        .forEach(descriptor => descriptor.notifyAssociatedResource(resourceName));
    }

    const resolvableAssociations = this.priorityList
      .map(descriptor => descriptor.resolveAssociation())
      .filter(d => d);
    if (resolvableAssociations.length > 0) {
      return Observable.forkJoin(...resolvableAssociations)
        .map(descriptors => {
          LOGGER.debug(`Found ${descriptors.length} descriptors for association in property ${this.getName()}.`);
          if (descriptors.length > 0) {
            return new CombiningDescriptor(descriptors);
          } else {
            return null;
          }
        });
    } else {
      return Observable.of(null);
    }
  }

  resolveAssociations(): Observable<ResourceDescriptor> {
    const thisResolution = this.resolveAssociation();
    return Observable.forkJoin(
      thisResolution.flatMap(resolvedDescriptor => resolvedDescriptor ? resolvedDescriptor.resolveAssociations() : Observable.of(null)),
      ...this.getChildren().map(child => child.resolveAssociations()))
      .map(() => this);
  }

  private getFirstResult<T>(f: (d: ResourceDescriptor) => T): T {
    for (const d of this.priorityList) {
      const result = f(d);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  private pushToArrayGivenByName(descriptorsByName: { [name: string]: ResourceDescriptor[] },
                                 newDescriptor: ResourceDescriptor) {
    const descriptors = descriptorsByName[newDescriptor.getName()];
    if (descriptors) {
      descriptors.push(newDescriptor);
    } else {
      descriptorsByName[newDescriptor.getName()] = [newDescriptor];
    }
    return descriptorsByName;
  }
}
