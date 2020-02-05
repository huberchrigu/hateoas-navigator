import {HalResourceFactory} from 'hateoas-navigator/hal-navigator/hal-resource/factory/hal-resource-factory';
import {HalResourceObject, ResourceObjectDescriptor} from 'hateoas-navigator';

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
