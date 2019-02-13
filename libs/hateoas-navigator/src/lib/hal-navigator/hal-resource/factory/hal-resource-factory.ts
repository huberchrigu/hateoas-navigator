import {HalResourceObject} from '../value-type/hal-value-type';
import {DeprecatedResourceDescriptor} from '../../descriptor/deprecated-resource-descriptor';
import {JsonResourceObject} from '../resource-object';
import {Observable} from 'rxjs';

/**
 * Creates new {@link JsonResourceObject}s.
 */
export interface HalResourceFactory {
  create(name: string, obj: HalResourceObject, descriptor: DeprecatedResourceDescriptor): JsonResourceObject;

  /**
   * @throws an error if no descriptor can be found the resource object's name.
   */
  resolveDescriptor(name: string, obj: HalResourceObject): Observable<JsonResourceObject>;
}
