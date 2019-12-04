import {ResourceDescriptorProvider} from '../provider/resource-descriptor-provider';
import {combineLatest, forkJoin, Observable, of} from 'rxjs';
import {ArrayPropertyDescriptor, AssociationPropertyDescriptor, ObjectPropertyDescriptor, PropDescriptor} from '../prop-descriptor';
import {map, flatMap, tap} from 'rxjs/operators';
import {LOGGER} from '../../../logging/logger';
import {ResourceDescriptor} from '../resource-descriptor';

/**
 * Recursively visits all descriptors and resolves all its associations if any.
 * <p>
 *     A resolver instance saves all already known resources and avoids cyclic resolutions.
 * </p>
 */
export class AssociationResolver {
  private cache: { [resourceName: string]: ResourceDescriptor } = {};

  constructor(private descriptorProvider: ResourceDescriptorProvider) {
  }

  fetchDescriptorWithAssociations(resourceName: string): Observable<ResourceDescriptor> {
    LOGGER.debug('Resolving ' + resourceName);
    const cached = this.cache[resourceName];
    if (cached) {
      return of(cached);
    }
    return this.descriptorProvider.resolve(resourceName).pipe(
      flatMap(desc => {
        this.cache[resourceName] = desc;
        return this.resolveAssociations(desc);
      }),
      tap(() => LOGGER.debug(resourceName + ' resolved'))
    );
  }

  /**
   * Resolves the associations of the descriptor itself (if any), of its children and its array items.
   */
  private resolveAssociations<T extends PropDescriptor>(descriptor: T): Observable<T> {
    const children = descriptor.orEmpty<ObjectPropertyDescriptor>(d => d.getChildDescriptors);
    const arrayItems = descriptor.orNull<ArrayPropertyDescriptor<PropDescriptor>, 'getItemsDescriptor'>(d => d.getItemsDescriptor);

    const resolvedChildren: Observable<PropDescriptor[]> = children.length > 0 ? this.resolveAll(children) : of([]);
    const resolvedArrayItem: Observable<PropDescriptor> = arrayItems ?
      this.resolveAssociations(arrayItems) :
      of(null);

    return combineLatest([this.resolveAssociation(descriptor), resolvedChildren, resolvedArrayItem])
      .pipe(map(() => descriptor));
  }

  private resolveAssociation(descriptor: PropDescriptor): Observable<ResourceDescriptor> {
    const associatedResourceName = descriptor.orNull<AssociationPropertyDescriptor, 'getAssociatedResourceName'>(d =>
      d.getAssociatedResourceName);
    return associatedResourceName ? this.fetchDescriptorWithAssociations(associatedResourceName)
        .pipe(tap(associatedResourceDesc => (descriptor as AssociationPropertyDescriptor).setResolvedResource(associatedResourceDesc))) :
      of(null);
  }

  private resolveAll(descriptors: Array<PropDescriptor>): Observable<PropDescriptor[]> {
    return forkJoin(descriptors.map(d => this.resolveAssociations(d)));
  }
}
