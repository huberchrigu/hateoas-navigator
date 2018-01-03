import {JsonObject, ResourceObject} from '@hal-navigator/resource-object/resource-object';
import {LinkFactory} from '@hal-navigator/link-object/link-factory';
import {ResourceLink} from '@hal-navigator/link-object/resource-link';
import {ResourceProperty} from '@hal-navigator/resource-object/properties/resource-property';
import {ResourceField} from '@hal-navigator/resource-object/resource-field';
import {Observable} from 'rxjs/Observable';
import {ResourceDescriptorResolver} from '@hal-navigator/descriptor/resource-descriptor-resolver';
import {AbstractResourceField} from '@hal-navigator/resource-object/abstract-resource-field';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';

/**
 * A resource object represents a HAL resource with links and - if any - embedded resource objects.
 */
// TODO: Change naming, actually it is a resource
export class ResourceObjectAdapter extends AbstractResourceField {
  private static LINKS_PROPERTY = '_links';
  private static EMBEDDED_PROPERTY = '_embedded';
  private static METADATA_PROPERTIES = [ResourceObjectAdapter.LINKS_PROPERTY, ResourceObjectAdapter.EMBEDDED_PROPERTY];

  private linkFactory: LinkFactory;

  constructor(public resourceObject: ResourceObject, private descriptorResolver: ResourceDescriptorResolver,
              descriptor: ResourceDescriptor = null) {
    super(descriptor);
    if (Array.isArray(resourceObject) || !resourceObject._links) {
      throw new Error('This is not a valid resource object: ' + JSON.stringify(resourceObject));
    }
    this.linkFactory = new LinkFactory(resourceObject._links, descriptorResolver);
  }

  getLinks(): ResourceLink[] {
    return this.linkFactory.getAll();
  }

  /**
   * The current resource can be extracted from the 'self' link.
   * @deprecated
   */
  getResourceName(): string {
    return this.getSelfLink().extractResourceName();
  }

  /**
   * Expects the embedded resources, i.e. it must be an array! Also assumes that the resource description remains the same.
   */
  getEmbeddedResources(linkRelationType: string): ResourceObjectAdapter[] {
    const embedded = this.getEmbedded(linkRelationType);
    if (Array.isArray(embedded)) {
      return embedded.map(e => new ResourceObjectAdapter(e, this.descriptorResolver, this.descriptor));
    } else {
      throw new Error('Embedded object ' + linkRelationType + ' was not an array as expected');
    }
  }

  /**
   * Returns the resource properties plus the embedded resources' properties.
   * Since {@link ResourceObjectAdapter} does not work for arrays, we convert them to resource properties.
   * @deprecated
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

  /**
   * @deprecated
   */
  getProperties(): ResourceProperty[] {
    return Object.keys(this.resourceObject)
      .filter(key => this.filterOutMetadata(key))
      .map(key => new ResourceProperty(key, this.resourceObject[key], this.getSubDescriptor(key)));
  }

  /**
   * This can either be a property or an embedded object.
   * @deprecated
   */
  getData<T>(propertyName: string, applyFunction: (data: ResourceField) => T): T | T[] {
    const value = this.resourceObject[propertyName];
    if (!value && this.resourceObject._embedded) {
      const embedded = this.resourceObject._embedded[propertyName];
      if (embedded) {
        return Array.isArray(embedded) ? embedded
            .map(e => new ResourceObjectAdapter(e, this.descriptorResolver, this.getSubDescriptor(propertyName)))
            .map(e => applyFunction(e))
          : applyFunction(new ResourceObjectAdapter(embedded, this.descriptorResolver, this.getSubDescriptor(propertyName)));
      }
    }
    return applyFunction(new ResourceProperty(propertyName, value, this.getSubDescriptor(propertyName)));
  }

  getFormValue(): string {
    return this.linkFactory.getLink(LinkFactory.SELF_RELATION_TYPE).getFullUriWithoutTemplatedPart();
  }

  /**
   * @deprecated
   */
  isUriType(): boolean {
    return true;
  }

  getSelfLink(): ResourceLink {
    return this.linkFactory.getLink(LinkFactory.SELF_RELATION_TYPE);
  }

  resolveDescriptor(): Observable<ResourceObjectAdapter> {
    return this.descriptorResolver.resolve(this.getResourceName())
      .map(descriptor => {
        if (!descriptor) {
          throw new Error('The descriptor resolver should return a descriptor');
        }
        this.descriptor = descriptor;
        return this;
      });
  }

  resolveDescriptorAndAssociations(): Observable<ResourceObjectAdapter> {
    return this.descriptorResolver.resolveWithAssociations(this.getResourceName()).map(descriptor => {
      this.descriptor = descriptor;
      return this;
    });
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

  protected toRawProperty(): JsonObject {
    return this.getRawPropertiesOf(this.resourceObject);
  }

  private toResourceProperty(resourceName: string, resource: ResourceObject | ResourceObject[]): ResourceProperty {
    if (Array.isArray(resource)) {
      return new ResourceProperty(resourceName, resource.map(r => this.getRawPropertiesOf(r)), this.getSubDescriptor(resourceName));
    }
    return new ResourceProperty(resourceName, this.toRawProperty(), this.getSubDescriptor(resourceName));
  }

  private getRawPropertiesOf(resourceObject: ResourceObject): JsonObject {
    const properties = {};
    Object.keys(resourceObject)
      .filter(key => this.filterOutMetadata(key))
      .forEach(key => properties[key] = resourceObject[key]);
    return properties;
  }
}
