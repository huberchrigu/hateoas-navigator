import {ResourceObject} from '../resource-object/resource-object';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';

/**
 * This is a resource item with a version.
 */
export class VersionedResourceObject extends ResourceObjectAdapter {

  constructor(resourceObject: ResourceObject, private version?: string) {
    super(resourceObject);
  }

  getVersion() {
    if (!this.version) {
      throw new Error('This item has no version');
    }
    return this.version;
  }
}
