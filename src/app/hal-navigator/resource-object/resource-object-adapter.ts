import {JsonObject, ResourceObject} from '@hal-navigator/resource-object/resource-object';
import {LinkFactory} from '@hal-navigator/link-object/link-factory';
import {ResourceLink} from '@hal-navigator/link-object/resource-link';
import {ResourceProperty} from '@hal-navigator/resource-object/properties/resource-property';
import {DataHolder} from '@hal-navigator/resource-object/resource-field';
import {DisplayValueConverter} from '@hal-navigator/resource-object/properties/display-value-converter';

/**
 * A resource object represents a HAL resource with links and - if any - embedded resource objects.
 */
export class ResourceObjectAdapter implements DataHolder {
  private static LINKS_PROPERTY = '_links';
  private static EMBEDDED_PROPERTY = '_embedded';
  private static METADATA_PROPERTIES = [ResourceObjectAdapter.LINKS_PROPERTY, ResourceObjectAdapter.EMBEDDED_PROPERTY];

  private linkFactory: LinkFactory;
  private displayValueConverter: DisplayValueConverter = new DisplayValueConverter();

  constructor(public resourceObject: ResourceObject) {
    if (Array.isArray(resourceObject) || !resourceObject._links) {
      throw new Error('This is not a valid resource object: ' + JSON.stringify(resourceObject));
    }
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

  /**
   * Expects the embedded resources, i.e. it must be an array!
   */
  getEmbeddedResources(linkRelationType: string): ResourceObjectAdapter[] {
    const embedded = this.getEmbedded(linkRelationType);
    if (Array.isArray(embedded)) {
      return embedded.map(e => new ResourceObjectAdapter(e));
    } else {
      throw new Error('Embedded object ' + linkRelationType + ' was not an array as expected');
    }
  }

  /**
   * Returns the resource properties plus the embedded resources' properties.
   * Since {@link ResourceObjectAdapter} does not work for arrays, we convert them to resource properties.
   */
  getAllData(): ResourceProperty[] {
    const properties: Array<ResourceProperty> = this.getProperties();
    const embedded = this.resourceObject._embedded;
    if (embedded) {
      properties.push(...Object.keys(embedded)
        .map(key => this.toResourceProperty(key, embedded[key])));
    }
    return properties;
  }

  getProperties(): ResourceProperty[] {
    return Object.keys(this.resourceObject)
      .filter(key => this.filterOutMetadata(key))
      .map(key => new ResourceProperty(key, this.resourceObject[key]));
  }

  /**
   * This can either be a property or an embedded object.
   */
  getData<T>(propertyName: string, applyFunction: (data: DataHolder) => T): T | T[] {
    const value = this.resourceObject[propertyName];
    if (!value && this.resourceObject._embedded) {
      const embedded = this.resourceObject._embedded[propertyName];
      if (embedded) {
        return Array.isArray(embedded) ? embedded
            .map(e => new ResourceObjectAdapter(e))
            .map(e => applyFunction(e))
          : applyFunction(new ResourceObjectAdapter(embedded));
      }
    }
    return applyFunction(new ResourceProperty(propertyName, value));
  }

  /**
   * Show only the this resource's properties and ignore any embedded resources.
   */
  getDisplayValue() {
    return this.displayValueConverter.transform(this.getRawProperties());
  }

  getFormValue(): string {
    return new ResourceLink('self', this.resourceObject._links.self).getFullUriWithoutTemplatedPart();
  }

  isUriType(): boolean {
    return true;
  }

  getSelfLink(): ResourceLink {
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

  private filterOutMetadata(key: string) {
    return !ResourceObjectAdapter.METADATA_PROPERTIES.some(p => p === key);
  }

  private getRawProperties(): JsonObject {
    return this.getRawPropertiesOf(this.resourceObject);
  }

  private toResourceProperty(resourceName: string, resource: ResourceObject | ResourceObject[]): ResourceProperty {
    if (Array.isArray(resource)) {
      return new ResourceProperty(resourceName, resource.map(r => this.getRawPropertiesOf(r)));
    }
    return new ResourceProperty(resourceName, this.getRawProperties());
  }

  private getRawPropertiesOf(resourceObject: ResourceObject): JsonObject {
    const properties = {};
    Object.keys(resourceObject)
      .filter(key => this.filterOutMetadata(key))
      .forEach(key => properties[key] = resourceObject[key]);
    return properties;
  }
}
