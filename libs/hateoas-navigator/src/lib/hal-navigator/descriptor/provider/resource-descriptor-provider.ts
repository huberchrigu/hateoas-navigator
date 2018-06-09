import {Observable} from 'rxjs';
import {ResourceDescriptor} from '../resource-descriptor';

export abstract class ResourceDescriptorProvider {
  abstract resolve(resourceName: string): Observable<ResourceDescriptor>;
}
