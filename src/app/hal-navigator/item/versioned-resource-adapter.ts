import {HalResource} from '../hal-resource/hal-resource';
import {ResourceAdapter} from '@hal-navigator/hal-resource/resource-adapter';
import {ResourceDescriptorResolver} from '@hal-navigator/descriptor/resolver/resource-descriptor-resolver';

/**
 * This is a resource object with a version.
 */
export class VersionedResourceAdapter extends ResourceAdapter {

  constructor(resourceName: string, resourceObject: HalResource, private version: string, descriptorResolver: ResourceDescriptorResolver) {
    super(resourceName, resourceObject, descriptorResolver);
  }

  getVersion() {
    if (!this.version) {
      throw new Error('This item has no version');
    }
    return this.version;
  }
}
