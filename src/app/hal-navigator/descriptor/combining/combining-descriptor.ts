import {ResourceDescriptor} from 'app/hal-navigator/descriptor/resource-descriptor';
import {NotNull} from '../../../decorators/not-null';
import {Observable} from 'rxjs/Observable';
import {AssociatedResourceResolver} from 'app/hal-navigator/descriptor/association/associated-resource-resolver';
import {AssociatedResourceListener} from 'app/hal-navigator/descriptor/association/associated-resource-listener';
import {LOGGER} from '../../../logging/logger';
import {FormField} from 'app/hal-navigator/schema/form/form-field';
import {FormFieldOptions} from 'app/hal-navigator/schema/form/form-field-options';
import {FormFieldType} from 'app/hal-navigator/schema/form/form-field-type';

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
    const fields = this.priorityList.map(d => d.toFormField()).filter(f => f);
    return this.mergeFormFields(fields);
  }

  private mergeFormFields(fields: Array<FormField>): FormField {
    const options = fields.map(f => f.options).filter(o => o);
    const formFieldOptions = new FormFieldOptions();
    const type = this.getFirstResultIn(fields, f => f.type);
    const formField = new FormField(
      this.getFirstResultIn(fields, f => f.name),
      type,
      this.getFirstResultIn(fields, f => f.required),
      this.getFirstResultIn(fields, f => f.readOnly),
      this.getFirstResultIn(fields, f => f.title),
      formFieldOptions
    );
    formFieldOptions.setLinkedResource(this.getFirstResultIn(options, o => o.getLinkedResource()));
    formFieldOptions.setOptions(this.getFirstResultIn(options, o => o.getOptions()));
    formFieldOptions.setDateTimeType(this.getFirstResultIn(options, o => o.getDateTimeType()));
    const arraySpecs = options.map(o => o.getArraySpec()).filter(f => f);
    if (arraySpecs.length > 0 && type === FormFieldType.ARRAY) {
      formFieldOptions.setArraySpec(this.mergeFormFields(arraySpecs));
    }
    const subFields = options.map(o => o.getSubFields()).filter(sf => sf);
    if (subFields.length > 0) {
      formFieldOptions.setSubFields(this.regroupAndMap(subFields,
        f => f.name, f => this.mergeFormFields(f)).filter(f => f));
    }
    return formField.type ? formField : null;
  }

  getChild(resourceName: string): ResourceDescriptor {
    return new CombiningDescriptor(this.priorityList
      .map(d => d.getChild(resourceName))
      .filter(d => d));
  }

  getChildren(): CombiningDescriptor[] {
    return this.regroupAndMap(this.priorityList.map(d => d.getChildren()),
      d => d.getName(),
      children => new CombiningDescriptor(children));
  }

  getAssociatedResource(): CombiningDescriptor {
    const all = this.priorityList.map(d => d.getAssociatedResource()).filter(d => d);
    return all.length > 0 ? new CombiningDescriptor(all) : null;
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

  resolveAssociations(): Observable<CombiningDescriptor> {
    const thisResolution = this.resolveAssociation();
    return Observable.forkJoin(
      thisResolution.flatMap(resolvedDescriptor => resolvedDescriptor ? resolvedDescriptor.resolveAssociations() : Observable.of(null)),
      ...this.getChildren().map(child => child.resolveAssociations()))
      .map(() => this);
  }

  private getFirstResult<T>(f: (d: ResourceDescriptor) => T): T {
    return this.getFirstResultIn(this.priorityList, f);
  }

  private getFirstResultIn<S, T>(array: Array<S>, f: (d: S) => T): T {
    for (const d of array) {
      const result = f(d);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  private regroupAndMap<T, U>(arrayOfArrays: Array<T[]>, groupByKey: (item: T) => string, finalMapping: (children: Array<T>) => U) {

    const arraysByName: { [key: string]: T[] } = arrayOfArrays
      .reduce((c1, c2) => c1.concat(c2), [])
      .reduce((children, child) => this.pushToArrayGivenByName(children, child, groupByKey), {});
    return Object.keys(arraysByName)
      .map(key => finalMapping(arraysByName[key]));
  }

  private pushToArrayGivenByName<T>(arraysByName: { [key: string]: T[] },
                                    newElement: T, groupByKey: (item: T) => string) {
    const key = groupByKey(newElement);
    const descriptors = arraysByName[key];
    if (descriptors) {
      descriptors.push(newElement);
    } else {
      arraysByName[key] = [newElement];
    }
    return arraysByName;
  }
}
