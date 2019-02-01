import {AbstractProperty} from './property/abstract-property';
import {ResourceDescriptor} from '../descriptor';
import {LinkFactory} from '../link-object/link-factory';
import {HalResourceObject, JsonObject} from './hal-resource-object';
import {ResourceDescriptorProvider} from '../descriptor/provider/resource-descriptor-provider';
import {ResourceLink} from '../link-object/resource-link';
import {ResourceProperty} from './property/resource-property';
import {JsonProperty} from './property/json-property';
import {Observable} from 'rxjs/index';
import {map} from 'rxjs/operators';
import {AssociationResolver} from '../descriptor/association/association-resolver';

/**
 * A resource representing a HAL resource with links and - if any - embedded resource objects.
 */
export class ResourceAdapter extends AbstractProperty<ResourceDescriptor> {
  private static LINKS_PROPERTY = '_links';
  private static EMBEDDED_PROPERTY = '_embedded';
  private static METADATA_PROPERTIES = [ResourceAdapter.LINKS_PROPERTY, ResourceAdapter.EMBEDDED_PROPERTY];

  private linkFactory: LinkFactory;

  constructor(name: string, public resourceObject: HalResourceObject, private descriptorResolver: ResourceDescriptorProvider,
              descriptor: ResourceDescriptor = null) {
    super(name, descriptor);
    if (Array.isArray(resourceObject) || !resourceObject._links) {
      throw new Error('This is not a valid resource object: ' + JSON.stringify(resourceObject));
    }
    this.linkFactory = new LinkFactory(resourceObject._links, descriptorResolver);
  }

  getLinks(): ResourceLink[] {
    return this.linkFactory.getAll();
  }

  /**
   * Expects the embedded resources, i.e. it must be an array!
   */
  getEmbeddedResources(linkRelationType: string, useMainDescriptor: boolean): ResourceAdapter[] {
    const embedded = this.getEmbedded(linkRelationType);
    if (Array.isArray(embedded)) {
      return embedded.map(e => new ResourceAdapter(linkRelationType, e, this.descriptorResolver,
        useMainDescriptor ? this.descriptor : this.getSubResourceDescriptor(linkRelationType)));
    } else {
      throw new Error('Embedded object ' + linkRelationType + ' was not an array as expected');
    }
  }

  getEmbeddedResourceOrNull(linkRelationType: string): ResourceAdapter {
    const resource = this.resourceObject._embedded[linkRelationType];
    if (Array.isArray(resource)) {
      return undefined;
    }
    return resource ? new ResourceAdapter(linkRelationType, resource, this.descriptorResolver, this.getSubResourceDescriptor(linkRelationType)) : undefined;
  }

  /**
   * Returns the resource properties plus the embedded resources' properties.
   * Since {@link ResourceAdapter} does not work for arrays, we convert them to resource properties.
   */
  getPropertiesAndEmbeddedResourcesAsProperties(): ResourceProperty[] {
    return this.getObjectProperties()
      .concat(this.getEmbeddedResourcesAsProperties());
  }

  /**
   * This can either be a property or an embedded object. If the property matches multiple embedded objects, the function is applied to all
   * objects.
   */
  getPropertyAs<T>(propertyName: string, applyFunction: (property: JsonProperty) => T): T | T[] {
    const value = this.resourceObject[propertyName];
    if (!value && this.resourceObject._embedded) {
      const embedded = this.resourceObject._embedded[propertyName];
      if (embedded) {
        return Array.isArray(embedded) ? embedded
            .map(e => new ResourceAdapter(propertyName, e, this.descriptorResolver, this.getSubResourceDescriptor(propertyName)))
            .map(e => applyFunction(e))
          : applyFunction(new ResourceAdapter(propertyName, embedded, this.descriptorResolver,
            this.getSubResourceDescriptor(propertyName)));
      }
    }
    return applyFunction(new ResourceProperty(propertyName, value, this.getSubPropertyDescriptor(propertyName)));
  }

  getFormValue(): string {
    return this.linkFactory.getLink(LinkFactory.SELF_RELATION_TYPE).getFullUriWithoutTemplatedPart();
  }

  getSelfLink(): ResourceLink {
    return this.linkFactory.getLink(LinkFactory.SELF_RELATION_TYPE);
  }

  getOtherLinks(): ResourceLink[] {
    return this.linkFactory.getAll().filter(link => link.getFullUriWithoutTemplatedPart() != this.getSelfLink().getFullUriWithoutTemplatedPart());
  }

  resolveDescriptor(): Observable<ResourceAdapter> {
    return this.descriptorResolver.resolve(this.getName()).pipe(
      map(descriptor => {
        if (!descriptor) {
          throw new Error('The descriptor resolver should return a descriptor');
        }
        this.descriptor = descriptor;
        return this;
      }));
  }

  resolveDescriptorAndAssociations(): Observable<ResourceAdapter> {
    return new AssociationResolver(this.descriptorResolver).fetchDescriptorWithAssociations(this.getName()).pipe(
      map(descriptor => {
        this.descriptor = descriptor;
        return this;
      }));
  }

  // TODO: Duplicate of ResourceProperty#getObjectProperties to avoid cyclic dependency
  getObjectProperties(): ResourceProperty[] {
    const value = this.toRawProperty();
    if (typeof value !== 'object') {
      throw new Error(JSON.stringify(value) + ' is not an object!');
    }
    return Object.keys(value).map(key => new ResourceProperty(key, value[key], this.getSubPropertyDescriptor(key)));
  }

  /**
   * Throws an error if embedded resource does not exist.
   */
  private getEmbedded(linkRelationType: string): HalResourceObject | HalResourceObject[] {
    const embedded = this.resourceObject._embedded[linkRelationType];
    if (embedded) {
      return embedded;
    } else {
      throw new Error(`Embedded object ${linkRelationType} does not exist.`);
    }
  }

  /**
   * Returns an empty list if there are no embedded resources.
   */
  private getEmbeddedResourcesAsProperties(): ResourceProperty[] {
    const embedded = this.resourceObject._embedded;
    if (!embedded) {
      return [];
    }
    return Object.keys(embedded).map(key => this.toResourceProperty(key, embedded[key]));
  }

  private filterOutMetadata(key: string): boolean {
    return !ResourceAdapter.METADATA_PROPERTIES.some(p => p === key);
  }

  protected toRawProperty(): JsonObject {
    return this.getRawPropertiesOf(this.resourceObject);
  }

  /**
   * Transforms the resource(s) to an object or array property.
   */
  private toResourceProperty(resourceName: string, resource: HalResourceObject | HalResourceObject[]): ResourceProperty {
    const rawValue = Array.isArray(resource) ? resource.map(r => this.getRawPropertiesOf(r)) : this.getRawPropertiesOf(resource);
    return new ResourceProperty(resourceName, rawValue, this.getSubPropertyDescriptor(resourceName));
  }

  /**
   * Removes the HAL metadata from the resource.
   */
  private getRawPropertiesOf(resourceObject: HalResourceObject): JsonObject {
    const properties = {};
    Object.keys(resourceObject)
      .filter(key => this.filterOutMetadata(key))
      .forEach(key => properties[key] = resourceObject[key]);
    return properties;
  }

  private getSubResourceDescriptor(embeddedRelationType: string): ResourceDescriptor {
    return this.descriptor ? this.descriptor.getChildResourceDesc(embeddedRelationType) : undefined;
  }
}
