import {ResourceObject} from '@hal-navigator/resource-object/resource-object';
import {LinkFactory} from '@hal-navigator/link-object/link-factory';
import {ResourceLink} from '@hal-navigator/link-object/resource-link';
import {ResourceProperties} from '@hal-navigator/resource-object/properties/resource-properties';
import {ResourceProperty} from '@hal-navigator/resource-object/properties/resource-property';

export class ResourceObjectAdapter {
  private static LINKS_PROPERTY = '_links';
  private static EMBEDDED_PROPERTY = '_embedded';

  private linkFactory: LinkFactory;

  constructor(public resourceObject: ResourceObject) {
    this.linkFactory = new LinkFactory(resourceObject._links);
  }

  getLinks(): ResourceLink[] {
    return this.linkFactory.getAll();
  }

  /**
   * The current resource can be extracted from the 'self' link.
   */
  getResourceName(): string {
    return this.getSelfLink().extractResourceName();
  }

  getEmbeddedObjects(linkRelationType: string): ResourceObjectAdapter[] {
    const embedded = this.getEmbedded(linkRelationType);
    if (Array.isArray(embedded)) {
      return embedded.map(e => new ResourceObjectAdapter(e));
    } else {
      throw new Error('Embedded object ' + linkRelationType + ' was not an array as expected');
    }
  }

  /**
   * Return the object's properties without the metadata plus the embedded object properties.
   * @returns {ResourceProperties}
   */
  getProperties(): ResourceProperties {
    const properties = ResourceProperties.fromObject(this.resourceObject,
      [ResourceObjectAdapter.LINKS_PROPERTY, ResourceObjectAdapter.EMBEDDED_PROPERTY]);
    const embedded = this.resourceObject._embedded;
    if (embedded) {
      Object.keys(embedded).forEach(key => properties.add(new ResourceProperty(key, embedded[key], true)));
    }
    return properties;
  }

  /**
   * This can either be a property or an embedded object.
   */
  getProperty(propertyName: string): ResourceProperty {
    const value = this.resourceObject[propertyName];
    if (!value && this.resourceObject._embedded) {
      const embedded = this.resourceObject._embedded[propertyName];
      if (embedded) {
        return new ResourceProperty(propertyName, embedded, true);
      }
    }
    return new ResourceProperty(propertyName, value);
  }

  getSelfUri() {
    return this.resourceObject._links.self.href;
  }

  getDisplayValue() {
    return new ResourceProperty(null, this.resourceObject, true).getDisplayValue();
  }

  private getSelfLink() {
    return this.linkFactory.getLink(LinkFactory.SELF_RELATION_TYPE);
  }

  private getEmbedded(linkRelationType: string): ResourceObject | ResourceObject[] {
    const embedded = this.resourceObject._embedded[linkRelationType];
    if (embedded) {
      return embedded;
    } else {
      throw new Error(`Embedded object ${linkRelationType} does not exist.`);
    }
  }
}
