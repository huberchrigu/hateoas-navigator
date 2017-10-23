import {ResourceObject} from '../resource-object/resource-object';
import {DeprecatedLinkFactory} from '../link-object/link-factory';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';
import {ResourceProperties} from '@hal-navigator/resource-object/properties/resource-properties';
import {ResourceProperty} from '@hal-navigator/resource-object/properties/resource-property';

export class ItemAdapter {

  private linkFactory = new DeprecatedLinkFactory();

  constructor(private resourceObject: ResourceObjectAdapter, private version?: string) {
  }

  /**
   * @deprecated
   */
  getDocument(): ResourceObject {
    return this.resourceObject.resourceObject;
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
