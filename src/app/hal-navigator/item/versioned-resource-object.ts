import {ResourceObject} from '../resource-object/resource-object';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';
import {ResourceDescriptorResolver} from '@hal-navigator/descriptor/resource-descriptor-resolver';

/**
 * This is a resource object with a version.
 */
export class VersionedResourceObject extends ResourceObjectAdapter {

  constructor(resourceObject: ResourceObject, private version: string, descriptorResolver: ResourceDescriptorResolver) {
    super(resourceObject, descriptorResolver);
  }

  getVersion() {
    if (!this.version) {
      throw new Error('This item has no version');
    }
    return this.version;
  }
}
