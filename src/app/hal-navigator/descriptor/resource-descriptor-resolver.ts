import {Observable} from 'rxjs/Observable';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';

export abstract class ResourceDescriptorResolver {
  abstract resolve(resourceName: string): Observable<ResourceDescriptor>;
  abstract resolveWithAssociations(resourceName: string): Observable<ResourceDescriptor>;
}
