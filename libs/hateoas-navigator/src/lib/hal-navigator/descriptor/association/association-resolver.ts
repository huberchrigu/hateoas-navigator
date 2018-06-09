import {flatMap} from 'rxjs/operators';
import {ResourceDescriptorProvider} from '../provider/resource-descriptor-provider';
import {combineLatest, forkJoin, Observable, of} from 'rxjs';
import {AssociatedResourceDescriptor} from './associated-resource-descriptor';
import {ResourceDescriptor} from '../resource-descriptor';
import {AssociatedPropertyDescriptor} from './associated-property-descriptor';
import {PropertyDescriptor} from '../property-descriptor';

/**
 * Recursively visits all descriptors and resolves all its associations if any.
 */
export class AssociationResolver {
  constructor(private descriptorProvider: ResourceDescriptorProvider) {
  }

  fetchDescriptorWithAssociations(resourceName: string): Observable<AssociatedResourceDescriptor> {
    return this.descriptorProvider.resolve(resourceName).pipe(flatMap(d => this.resolveAssociationsOfResource(d)));
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

    const resolvedChildren: Observable<ChildDescriptors> = children.length > 0 ? this.resolveAll(children) : of([]);
    const resolvedArrayItem: Observable<AssociatedPropertyDescriptor> = arrayItems ? this.resolveAssociationsOfProperty(arrayItems) :
      of(null);

    return combineLatest<AssociatedResourceDescriptor,
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
      return of(null);
    }
  }

  private resolveAll(descriptors: Array<PropertyDescriptor>) {
    return forkJoin(descriptors.map(d => this.resolveAssociationsOfProperty(d)));
  }
}

type AssociatedDescriptorFactory<A extends AssociatedPropertyDescriptor> =
  (associatedResource: AssociatedResourceDescriptor,
   associatedChildren: ChildDescriptors,
   associatedArrayItems: AssociatedPropertyDescriptor) => A;

type ChildDescriptors = Array<AssociatedPropertyDescriptor>;
