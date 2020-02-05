import {Observable} from 'rxjs';
import {ResourceObjectDescriptor} from '../resource-object-descriptor';

export abstract class ResourceDescriptorProvider {
  abstract resolve(resourceName: string): Observable<ResourceObjectDescriptor>;
}
