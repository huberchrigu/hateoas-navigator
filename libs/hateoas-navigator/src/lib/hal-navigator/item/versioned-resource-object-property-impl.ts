import {ResourceObjectPropertyImpl} from '../hal-resource';
import {HalResourceObject} from '../hal-resource';
import {HalPropertyFactory} from '../hal-resource/factory/hal-property-factory';
import {HalResourceFactory} from '../hal-resource/factory/hal-resource-factory';
import {LinkFactory} from '../link-object/link-factory';
import {VersionedResourceObjectProperty} from '../hal-resource';
import {ResourceObjectDescriptor} from '../descriptor';

/**
 * This is a resource object with a version.
 */
export class VersionedResourceObjectPropertyImpl extends ResourceObjectPropertyImpl implements VersionedResourceObjectProperty {
  constructor(private version: string | null, name: string, resourceObject: HalResourceObject | null, propertyFactory: HalPropertyFactory,
              resourceFactory: HalResourceFactory, linkFactory: LinkFactory, descriptor: ResourceObjectDescriptor | null) {
    super(name, resourceObject, propertyFactory, resourceFactory, linkFactory, descriptor);
  }

  getVersion() {
    if (!this.version) {
      throw new Error('This item has no version');
    }
    return this.version;
  }
}
