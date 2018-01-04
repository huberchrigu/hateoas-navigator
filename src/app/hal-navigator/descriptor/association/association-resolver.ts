import {ResourceDescriptorProvider} from 'app/hal-navigator/descriptor/provider/resource-descriptor-provider';
import {Observable} from 'rxjs/Observable';
import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {AssociatedDescriptor} from '@hal-navigator/descriptor/association/associated-descriptor';
import 'rxjs/add/observable/combineLatest';

export class AssociationResolver {
  constructor(private descriptorProvider: ResourceDescriptorProvider) {
  }

  fetchDescriptorWithAssociations(resourceName: string): Observable<AssociatedDescriptor> {
    return this.descriptorProvider.resolve(resourceName)
      .flatMap(d => this.resolveAssociations(d));
  }

  private resolveAssociations(descriptor: PropertyDescriptor): Observable<AssociatedDescriptor> {
    const children = descriptor.getChildren();
    const resolvedChildren: Observable<Array<AssociatedDescriptor>> = children.length > 0 ? Observable.forkJoin(children
      .map(d => this.resolveAssociations(d))) : Observable.of([]);

    return Observable.combineLatest<AssociatedDescriptor, Array<AssociatedDescriptor>, AssociatedDescriptor>(
      this.resolveAssociation(descriptor), resolvedChildren,
      (associatedResource, associatedChildren) => new AssociatedDescriptor(descriptor, associatedResource, associatedChildren)
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
