import {Observable} from 'rxjs/Observable';
import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';

export abstract class ResourceDescriptorResolver {
  abstract resolve(resourceName: string): Observable<PropertyDescriptor>;
  abstract resolveWithAssociations(resourceName: string): Observable<PropertyDescriptor>;
}
