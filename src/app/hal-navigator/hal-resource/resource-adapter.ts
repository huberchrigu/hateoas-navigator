import {JsonObject, HalResource} from '@hal-navigator/hal-resource/hal-resource';
import {LinkFactory} from 'app/hal-navigator/link-object/link-factory';
import {ResourceLink} from 'app/hal-navigator/link-object/resource-link';
import {ResourceProperty} from '@hal-navigator/hal-resource/property/resource-property';
import {JsonProperty} from '@hal-navigator/hal-resource/property/json-property';
import {Observable} from 'rxjs/Observable';
import {ResourceDescriptorResolver} from 'app/hal-navigator/descriptor/resolver/resource-descriptor-resolver';
import {AbstractProperty} from '@hal-navigator/hal-resource/property/abstract-property';
import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';

/**
 * A resource representing a HAL resource with links and - if any - embedded resource objects.
 */
export class ResourceAdapter extends AbstractProperty {
  private static LINKS_PROPERTY = '_links';
  private static EMBEDDED_PROPERTY = '_embedded';
  private static METADATA_PROPERTIES = [ResourceAdapter.LINKS_PROPERTY, ResourceAdapter.EMBEDDED_PROPERTY];

  private linkFactory: LinkFactory;

  constructor(name: string, public resourceObject: HalResource, private descriptorResolver: ResourceDescriptorResolver,
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
  getEmbeddedResources(linkRelationType: string, useMainDescriptor): ResourceAdapter[] {
    const embedded = this.getEmbedded(linkRelationType);
    if (Array.isArray(embedded)) {
      return embedded.map(e => new ResourceAdapter(linkRelationType, e, this.descriptorResolver,
        useMainDescriptor ? this.descriptor : this.getSubDescriptor(linkRelationType)));
      // TODO: Make sure that the descriptor is the same!
    } else {
      throw new Error('Embedded object ' + linkRelationType + ' was not an array as expected');
    }
  }

  /**
   * Returns the resource properties plus the embedded resources' properties.
   * Since {@link ResourceAdapter} does not work for arrays, we convert them to resource properties.
   * TODO: Remove usages by toResourceProperty().getProperties() or similar.
   * @deprecated
   */
  getAllData(): ResourceProperty[] {
    const properties: Array<ResourceProperty> = this.getObjectProperties();
    const embedded = this.resourceObject._embedded;
    if (embedded) {
      properties.push(...Object.keys(embedded)
        .map(key => this.toResourceProperty(key, embedded[key])));
    }
    return properties;
  }

  /**
   * This can either be a property or an embedded object.
   * @deprecated
   */
  getData<T>(propertyName: string, applyFunction: (data: JsonProperty) => T): T | T[] {
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
    return this.descriptorResolver.resolveWithAssociations(this.getName()).map(descriptor => {
      this.descriptor = descriptor;
      return this;
    });
  }

  private getEmbedded(linkRelationType: string): HalResource | HalResource[] {
    const embedded = this.resourceObject._embedded[linkRelationType];
    if (embedded) {
      return embedded;
    } else {
      throw new Error(`Embedded object ${linkRelationType} does not exist.`);
    }
  }

  private filterOutMetadata(key: string) {
    return !ResourceAdapter.METADATA_PROPERTIES.some(p => p === key);
  }

  protected toRawProperty(): JsonObject {
    return this.getRawPropertiesOf(this.resourceObject);
  }

  private toResourceProperty(resourceName: string, resource: HalResource | HalResource[]): ResourceProperty {
    if (Array.isArray(resource)) {
      return new ResourceProperty(resourceName, resource.map(r => this.getRawPropertiesOf(r)), this.getSubDescriptor(resourceName));
    }
    return new ResourceProperty(resourceName, this.toRawProperty(), this.getSubDescriptor(resourceName));
  }

  private getRawPropertiesOf(resourceObject: HalResource): JsonObject {
    const properties = {};
    Object.keys(resourceObject)
      .filter(key => this.filterOutMetadata(key))
      .forEach(key => properties[key] = resourceObject[key]);
    return properties;
  }
}
