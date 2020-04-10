import {HalResourceFactory} from './factory/hal-resource-factory';
import {HalResourceObject} from './value-type/hal-value-type';
import {ResourceObjectDescriptor} from '../descriptor/resource-object-descriptor';

/**
 * {@link ResourceObjectDescriptor}-aware implementation of a {@link HalResourceFactory}.
 */
export class ResourceObjectFactory {
  constructor(private resourceFactory: HalResourceFactory, private descriptorIfAny: ResourceObjectDescriptor) {
  }

  /**
   * @see HalResourceObject.createResourceObjectProperty
   */
  createResourceObjectProperty(linkRelationType: string, resource: HalResourceObject, useMainDescriptor: boolean) {
    return this.resourceFactory.createResourceObjectProperty(linkRelationType, resource, useMainDescriptor, this.descriptorIfAny);
  }
}
