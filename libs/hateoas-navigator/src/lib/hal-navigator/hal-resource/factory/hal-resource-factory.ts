import {HalResourceObject} from '../value-type/hal-value-type';
import {ResourceDescriptor} from '../../descriptor/resource-descriptor';
import {ResourceObjectProperty} from '../resource-object-property';
import {Observable} from 'rxjs';

/**
 * Creates new {@link ResourceObjectProperty}s.
 */
export interface HalResourceFactory {
  create(name: string, obj: HalResourceObject, descriptor: ResourceDescriptor): ResourceObjectProperty;

  /**
   * @throws an error if no descriptor can be found the resource object's name.
   */
  resolveDescriptor(name: string, obj: HalResourceObject): Observable<ResourceObjectProperty>;
}
