import {ResourceDescriptorProvider} from 'app/hal-navigator/descriptor/provider/resource-descriptor-provider';
import {Observable} from 'rxjs/Observable';
import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {AssociatedPropertyDescriptor} from '@hal-navigator/descriptor/association/associated-property-descriptor';
import 'rxjs/add/observable/combineLatest';
import {AssociatedResourceDescriptor} from '@hal-navigator/descriptor/association/associated-resource-descriptor';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';

/**
 * Recursively visits all descriptors and resolves all its associations if any.
 */
export class AssociationResolver {
  constructor(private descriptorProvider: ResourceDescriptorProvider) {
  }

  fetchDescriptorWithAssociations(resourceName: string): Observable<AssociatedResourceDescriptor> {
    return this.descriptorProvider.resolve(resourceName)
      .flatMap(d => this.resolveAssociationsOfResource(d));
  }

  private resolveAssociationsOfResource(descriptor: ResourceDescriptor): Observable<AssociatedResourceDescriptor> {
    return this.resolveAssociations(descriptor,
      (associatedResource, associatedChildren, associatedArrayItems) => new AssociatedResourceDescriptor(
        descriptor, associatedResource, associatedChildren, associatedArrayItems));
  }

  private resolveAssociationsOfProperty(descriptor: PropertyDescriptor): Observable<AssociatedPropertyDescriptor> {
    return this.resolveAssociations(descriptor,
      (associatedResource, associatedChildren, associatedArrayItems) => new AssociatedPropertyDescriptor(
        descriptor, associatedResource, associatedChildren, associatedArrayItems));
  }

  /**
   * Resolves the associations of the descriptor itself, of its children and its array items. Then the resulting descriptors are merged
   * into {@link AssociatedPropertyDescriptor}.
   */
  private resolveAssociations<D extends PropertyDescriptor,
    A extends AssociatedPropertyDescriptor>(descriptor: D, mappingFunction: AssociatedDescriptorFactory<A>): Observable<A> {
    const children = descriptor.getChildrenDescriptors();
    const arrayItems = descriptor.getArrayItemsDescriptor();

    const resolvedChildren: Observable<ChildDescriptors> = children.length > 0 ? this.resolveAll(children) : Observable.of([]);
    const resolvedArrayItem: Observable<AssociatedPropertyDescriptor> = arrayItems ? this.resolveAssociationsOfProperty(arrayItems) :
      Observable.of(null);

    return Observable.combineLatest<AssociatedResourceDescriptor,
      ChildDescriptors, AssociatedPropertyDescriptor, A>(
      this.resolveAssociation(descriptor), resolvedChildren, resolvedArrayItem,
      (associatedResource, associatedChildren, associatedArrayItem) => mappingFunction(associatedResource,
        associatedChildren, associatedArrayItem)
    );
  }

  private resolveAssociation(descriptor: PropertyDescriptor): Observable<AssociatedResourceDescriptor> {
    const associatedResourceName = descriptor.getAssociatedResourceName();
    if (associatedResourceName) {
      return this.fetchDescriptorWithAssociations(associatedResourceName);
    } else {
      return Observable.of(null);
    }
  }

  private resolveAll(descriptors: Array<PropertyDescriptor>) {
    return Observable.forkJoin(descriptors.map(d => this.resolveAssociationsOfProperty(d)));
  }
}

type AssociatedDescriptorFactory<A extends AssociatedPropertyDescriptor> =
  (associatedResource: AssociatedResourceDescriptor,
   associatedChildren: ChildDescriptors,
   associatedArrayItems: AssociatedPropertyDescriptor) => A;

type ChildDescriptors = Array<AssociatedPropertyDescriptor>;
