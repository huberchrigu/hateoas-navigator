import {ResourceObjectPropertyImpl} from '../hal-resource/resource-object-property-impl';
import {HalResourceObject} from '../hal-resource/value-type/hal-value-type';
import {HalPropertyFactory} from '../hal-resource/factory/hal-property-factory';
import {HalResourceFactory} from '../hal-resource/factory/hal-resource-factory';
import {LinkFactory} from '../link-object/link-factory';
import {VersionedResourceObjectProperty} from '../hal-resource/resource-object-property';
import {ResourceObjectDescriptor} from '../descriptor/resource-object-descriptor';

/**
 * This is a resource object with a version.
 */
export class VersionedResourceObjectPropertyImpl extends ResourceObjectPropertyImpl implements VersionedResourceObjectProperty {
  constructor(private version: string, name: string, resourceObject: HalResourceObject, propertyFactory: HalPropertyFactory,
              resourceFactory: HalResourceFactory, linkFactory: LinkFactory, descriptor: ResourceObjectDescriptor) {
    super(name, resourceObject, propertyFactory, resourceFactory, linkFactory, descriptor);
  }

  getVersion() {
    if (!this.version) {
      throw new Error('This item has no version');
    }
    return this.version;
  }
}
