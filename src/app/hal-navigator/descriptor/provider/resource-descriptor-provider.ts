import {Observable} from 'rxjs/Observable';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';

export abstract class ResourceDescriptorProvider {
  abstract resolve(resourceName: string): Observable<ResourceDescriptor>;
}
