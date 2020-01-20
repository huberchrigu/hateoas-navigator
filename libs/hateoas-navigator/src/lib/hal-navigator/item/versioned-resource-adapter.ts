import {JsonResourceObjectImpl} from '../hal-resource/json-resource-object-impl';
import {HalResourceObject} from '../hal-resource/value-type/hal-value-type';
import {HalPropertyFactory} from '../hal-resource/factory/hal-property-factory';
import {HalResourceFactory} from '../hal-resource/factory/hal-resource-factory';
import {LinkFactory} from '../link-object/link-factory';
import {ResourceDescriptor} from '../descriptor/resource-descriptor';
import {VersionedJsonResourceObject} from '../hal-resource/json-resource-object';

/**
 * This is a resource object with a version.
 */
export class VersionedResourceAdapter extends JsonResourceObjectImpl implements VersionedJsonResourceObject {
  constructor(private version: string, name: string, resourceObject: HalResourceObject, propertyFactory: HalPropertyFactory,
              resourceFactory: HalResourceFactory, linkFactory: LinkFactory, descriptor: ResourceDescriptor) {
    super(name, resourceObject, propertyFactory, resourceFactory, linkFactory, descriptor);
  }

  getVersion() {
    if (!this.version) {
      throw new Error('This item has no version');
    }
    return this.version;
  }
}
