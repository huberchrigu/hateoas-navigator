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

  getProperties(): ResourceProperties {
    return ResourceProperties.fromObject(this.resourceObject,
      [ResourceObjectAdapter.LINKS_PROPERTY, ResourceObjectAdapter.EMBEDDED_PROPERTY]);
  }

  getProperty(propertyName: string) {
    const value = this.resourceObject[propertyName];
    return new ResourceProperty(propertyName, value);
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
