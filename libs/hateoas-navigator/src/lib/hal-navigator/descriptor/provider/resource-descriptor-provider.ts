import {Observable} from 'rxjs';
import {DeprecatedResourceDescriptor} from '../deprecated-resource-descriptor';

export abstract class ResourceDescriptorProvider {
  abstract resolve(resourceName: string): Observable<DeprecatedResourceDescriptor>;
}
