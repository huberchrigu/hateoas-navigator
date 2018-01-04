import {JsonObject, HalResource} from '@hal-navigator/hal-resource/hal-resource';
import {LinkFactory} from 'app/hal-navigator/link-object/link-factory';
import {ResourceLink} from 'app/hal-navigator/link-object/resource-link';
import {ResourceProperty} from '@hal-navigator/hal-resource/property/resource-property';
import {JsonProperty} from '@hal-navigator/hal-resource/property/json-property';
import {Observable} from 'rxjs/Observable';
import {ResourceDescriptorProvider} from 'app/hal-navigator/descriptor/provider/resource-descriptor-provider';
import {AbstractProperty} from '@hal-navigator/hal-resource/property/abstract-property';
import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {AssociationResolver} from '@hal-navigator/descriptor/association/association-resolver';

/**
 * A resource representing a HAL resource with links and - if any - embedded resource objects.
 */
export class ResourceAdapter extends AbstractProperty {
  private static LINKS_PROPERTY = '_links';
  private static EMBEDDED_PROPERTY = '_embedded';
  private static METADATA_PROPERTIES = [ResourceAdapter.LINKS_PROPERTY, ResourceAdapter.EMBEDDED_PROPERTY];

  private linkFactory: LinkFactory;

  constructor(name: string, public resourceObject: HalResource, private descriptorResolver: ResourceDescriptorProvider,
              descriptor: PropertyDescriptor = null) {
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
        useMainDescriptor ? this.descriptor : this.getSubDescriptor(linkRelationType)));
    } else {
      throw new Error('Embedded object ' + linkRelationType + ' was not an array as expected');
    }
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
            .map(e => new ResourceAdapter(propertyName, e, this.descriptorResolver, this.getSubDescriptor(propertyName)))
            .map(e => applyFunction(e))
          : applyFunction(new ResourceAdapter(propertyName, embedded, this.descriptorResolver, this.getSubDescriptor(propertyName)));
      }
    }
    return applyFunction(new ResourceProperty(propertyName, value, this.getSubDescriptor(propertyName)));
  }

  getFormValue(): string {
    return this.linkFactory.getLink(LinkFactory.SELF_RELATION_TYPE).getFullUriWithoutTemplatedPart();
  }

  getSelfLink(): ResourceLink {
    return this.linkFactory.getLink(LinkFactory.SELF_RELATION_TYPE);
  }

  resolveDescriptor(): Observable<ResourceAdapter> {
    return this.descriptorResolver.resolve(this.getName())
      .map(descriptor => {
        if (!descriptor) {
          throw new Error('The descriptor resolver should return a descriptor');
        }
        this.descriptor = descriptor;
        return this;
      });
  }

  resolveDescriptorAndAssociations(): Observable<ResourceAdapter> {
    return new AssociationResolver(this.descriptorResolver).fetchDescriptorWithAssociations(this.getName())
      .map(descriptor => {
        this.descriptor = descriptor;
        return this;
      });
  }

  /**
   * Throws an error if embedded resource does not exist.
   */
  private getEmbedded(linkRelationType: string): HalResource | HalResource[] {
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
  private toResourceProperty(resourceName: string, resource: HalResource | HalResource[]): ResourceProperty {
    const rawValue = Array.isArray(resource) ? resource.map(r => this.getRawPropertiesOf(r)) : this.getRawPropertiesOf(resource);
    return new ResourceProperty(resourceName, rawValue, this.getSubDescriptor(resourceName));
  }

  /**
   * Removes the HAL metadata from the resource.
   */
  private getRawPropertiesOf(resourceObject: HalResource): JsonObject {
    const properties = {};
    Object.keys(resourceObject)
      .filter(key => this.filterOutMetadata(key))
      .forEach(key => properties[key] = resourceObject[key]);
    return properties;
  }
}
