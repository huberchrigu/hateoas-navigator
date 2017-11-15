import {ResourceObject} from '../resource-object/resource-object';
import {DeprecatedLinkFactory} from '../link-object/link-factory';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';
import {ResourceProperties} from '@hal-navigator/resource-object/properties/resource-properties';
import {ResourceProperty} from '@hal-navigator/resource-object/properties/resource-property';

/**
 * Treat embedded objects as properties of object type with a link.
 */
export class ItemAdapter {

  private linkFactory = new DeprecatedLinkFactory();

  constructor(private resourceObject: ResourceObjectAdapter, private version?: string) {
  }

  getDisplayValue(): string {
    return this.resourceObject.getDisplayValue() as string;
  }

  /**
   * @deprecated
   */
  getDocument(): ResourceObject {
    return this.resourceObject.resourceObject;
  }

  getItemUri(): string {
    return this.resourceObject.getSelfUri();
  }

  getProperties(): ResourceProperties {
    return this.resourceObject.getProperties();
  }

  /**
   * @deprecated
   */
  getDetailLink(): string {
    return this.linkFactory.fromDocument(this.resourceObject.resourceObject);
  }

  getVersion() {
    if (!this.version) {
      throw new Error('This item has no version');
    }
    return this.version;
  }

  getProperty(propertyName: string): ResourceProperty {
    return this.resourceObject.getProperty(propertyName);
  }
}
