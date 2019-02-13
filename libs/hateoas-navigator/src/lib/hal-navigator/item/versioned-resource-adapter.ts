import {ResourceAdapter} from '../hal-resource/resource-adapter';
import {HalResourceObject} from '../hal-resource/value-type/hal-value-type';
import {HalPropertyFactory} from '../hal-resource/factory/hal-property-factory';
import {HalResourceFactory} from '../hal-resource/factory/hal-resource-factory';
import {LinkFactory} from '../link-object/link-factory';
import {DeprecatedResourceDescriptor} from '../descriptor/deprecated-resource-descriptor';
import {VersionedJsonResourceObject} from '../hal-resource/resource-object';

/**
 * This is a resource object with a version.
 */
export class VersionedResourceAdapter extends ResourceAdapter implements VersionedJsonResourceObject {
  constructor(private version: string, name: string, resourceObject: HalResourceObject, propertyFactory: HalPropertyFactory, resourceFactory: HalResourceFactory, linkFactory: LinkFactory,
              descriptor: DeprecatedResourceDescriptor) {
    super(name, resourceObject, propertyFactory, resourceFactory, linkFactory, descriptor);
  }

  getVersion() {
    if (!this.version) {
      throw new Error('This item has no version');
    }
    return this.version;
  }
}
