import {HalResource} from '../hal-resource/hal-resource';
import {ResourceAdapter} from '../hal-resource/resource-adapter';
import {ResourceDescriptorProvider} from '../descriptor/provider/resource-descriptor-provider';

/**
 * This is a resource object with a version.
 */
export class VersionedResourceAdapter extends ResourceAdapter {

  constructor(resourceName: string, resourceObject: HalResource, private version: string, descriptorResolver: ResourceDescriptorProvider) {
    super(resourceName, resourceObject, descriptorResolver);
  }

  getVersion() {
    if (!this.version) {
      throw new Error('This item has no version');
    }
    return this.version;
  }
}