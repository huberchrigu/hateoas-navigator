import {HalResourceObject} from '../value-type/hal-value-type';
import {ResourceDescriptor} from '../../descriptor/resource-descriptor';
import {JsonResourceObject} from '../json-resource-object';
import {Observable} from 'rxjs';

/**
 * Creates new {@link JsonResourceObject}s.
 */
export interface HalResourceFactory {
  create(name: string, obj: HalResourceObject, descriptor: ResourceDescriptor): JsonResourceObject;

  /**
   * @throws an error if no descriptor can be found the resource object's name.
   */
  resolveDescriptor(name: string, obj: HalResourceObject): Observable<JsonResourceObject>;
}
