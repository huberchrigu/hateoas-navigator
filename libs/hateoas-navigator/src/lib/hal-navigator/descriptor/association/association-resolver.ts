import {ResourceDescriptorProvider} from '../provider/resource-descriptor-provider';
import {combineLatest, forkJoin, Observable, of} from 'rxjs';
import {AssociatedResourceDescriptor} from './associated-resource-descriptor';
import {AssociatedPropertyDescriptor} from './associated-property-descriptor';
import {PropertyDescriptor} from '../property-descriptor';
import {map, flatMap, tap} from 'rxjs/operators';

/**
 * Recursively visits all descriptors and resolves all its associations if any.
 * <p>
 *     A resolver instance saves all already known resources and avoids cyclic resolutions.
 * </p>
 */
export class AssociationResolver {
  private cache: { [resourceName: string]: AssociatedResourceDescriptor } = {};

  constructor(private descriptorProvider: ResourceDescriptorProvider) {
  }

  fetchDescriptorWithAssociations(resourceName: string): Observable<AssociatedResourceDescriptor> {
    const cached = this.cache[resourceName];
    if (cached) {
      return of(cached);
    }
    return this.descriptorProvider.resolve(resourceName).pipe(
      flatMap(desc => {
        this.cache[resourceName] = new AssociatedResourceDescriptor(desc, undefined, undefined, undefined);
        return this.resolveAssociations(desc, this.cache[resourceName]);
      }));
  }

  /**
   * Resolves the associations of the descriptor itself, of its children and its array items. Then the resulting descriptors are merged
   * into {@link AssociatedPropertyDescriptor}.
   */
  private resolveAssociations<T extends PropertyDescriptor, D extends AssociatedPropertyDescriptor>(originalDescriptor: T, newDescriptor: D): Observable<D> {
    const children = originalDescriptor.getChildrenDescriptors();
    const arrayItems = originalDescriptor.getArrayItemsDescriptor();

    const resolvedChildren: Observable<AssociatedPropertyDescriptor[]> = children.length > 0 ? this.resolveAll(children) : of([]);
    const resolvedArrayItem: Observable<AssociatedPropertyDescriptor> = arrayItems ?
      this.resolveAssociations(arrayItems, new AssociatedPropertyDescriptor(arrayItems, undefined, undefined, undefined)) :
      of(null);

    return combineLatest(this.resolveAssociation(originalDescriptor), resolvedChildren, resolvedArrayItem)
      .pipe(tap(([associatedResource, associatedChildren, associatedArrayItem]) => newDescriptor.update(associatedResource, associatedChildren, associatedArrayItem)),
        map(() => newDescriptor));
  }

  private resolveAssociation(descriptor: PropertyDescriptor): Observable<AssociatedResourceDescriptor> {
    const associatedResourceName = descriptor.getAssociatedResourceName();
    if (associatedResourceName) {
      return this.fetchDescriptorWithAssociations(associatedResourceName);
    } else {
      return of(null);
    }
  }

  private resolveAll(descriptors: Array<PropertyDescriptor>): Observable<AssociatedPropertyDescriptor[]> {
    return forkJoin(descriptors.map(d => this.resolveAssociations(d,
      new AssociatedPropertyDescriptor(d, undefined, undefined, undefined)
    )));
  }
}
