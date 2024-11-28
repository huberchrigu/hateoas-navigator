import {HalResourceObject} from '../value-type';
import {ResourceObjectDescriptor} from '../../descriptor';
import {ResourceObjectProperty} from '../resource-object-property';
import {Observable} from 'rxjs';

/**
 * Creates new {@link ResourceObjectProperty}s.
 */
export interface HalResourceFactory {
  create(name: string, obj: HalResourceObject, descriptor: ResourceObjectDescriptor | null): ResourceObjectProperty;

  /**
   * @param name The name of the resource object.
   * @param obj The object value.
   * @param useMainDescriptor If true, the <code>parentDescriptor</code> is used for the new resource object (for array descriptors).
   * Otherwise the sub-descriptor with <code>name</code> is taken.
   */
  createResourceObjectProperty(name: string, obj: HalResourceObject, useMainDescriptor: boolean, parentDescriptor: ResourceObjectDescriptor): any;

  /**
   * @throws an error if no descriptor can be found the resource object's name.
   */
  resolveDescriptor(name: string, obj: HalResourceObject): Observable<ResourceObjectProperty>;
}
