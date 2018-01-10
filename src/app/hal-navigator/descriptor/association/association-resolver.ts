import {ResourceDescriptorProvider} from 'app/hal-navigator/descriptor/provider/resource-descriptor-provider';
import {Observable} from 'rxjs/Observable';
import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {AssociatedDescriptor} from '@hal-navigator/descriptor/association/associated-descriptor';
import 'rxjs/add/observable/combineLatest';

/**
 * Recursively visits all descriptors and resolves all its associations if any.
 */
export class AssociationResolver {
  constructor(private descriptorProvider: ResourceDescriptorProvider) {
  }

  fetchDescriptorWithAssociations(resourceName: string): Observable<AssociatedDescriptor> {
    return this.descriptorProvider.resolve(resourceName)
      .flatMap(d => this.resolveAssociations(d));
  }

  /**
   * Resolves the associations of the descriptor itself, of its children and its array items. Then the resulting descriptors are merged
   * into {@link AssociatedDescriptor}.
   */
  private resolveAssociations(descriptor: PropertyDescriptor): Observable<AssociatedDescriptor> {
    const children = descriptor.getChildrenDescriptors();
    const arrayItems = descriptor.getArrayItemsDescriptor();

    const resolvedChildren: Observable<Array<AssociatedDescriptor>> = children.length > 0 ? Observable.forkJoin(children
      .map(d => this.resolveAssociations(d))) : Observable.of([]);
    const resolvedArrayItem: Observable<AssociatedDescriptor> = arrayItems ? this.resolveAssociations(arrayItems) : Observable.of(null);

    return Observable.combineLatest<AssociatedDescriptor, Array<AssociatedDescriptor>, AssociatedDescriptor, AssociatedDescriptor>(
      this.resolveAssociation(descriptor), resolvedChildren, resolvedArrayItem,
      (associatedResource, associatedChildren, associatedArrayItem) => new AssociatedDescriptor(descriptor, associatedResource,
        associatedChildren, associatedArrayItem)
    );
  }

  private resolveAssociation(descriptor: PropertyDescriptor): Observable<AssociatedDescriptor> {
    const associatedResourceName = descriptor.getAssociatedResourceName();
    if (associatedResourceName) {
      return this.fetchDescriptorWithAssociations(associatedResourceName);
    } else {
      return Observable.of(null);
    }
  }
}
