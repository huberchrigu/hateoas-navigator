import {Observable} from 'rxjs/Observable';
import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';

export abstract class ResourceDescriptorProvider {
  abstract resolve(resourceName: string): Observable<PropertyDescriptor>;
}
