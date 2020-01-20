import {ResourceDescriptor} from '../descriptor';
import {LinkFactory} from '../link-object/link-factory';
import {HalResourceObject, HalValueType} from './value-type/hal-value-type';
import {JsonObjectProperty} from '../json-property/object/object-property';
import {ObjectPropertyDescriptor} from '../descriptor/prop-descriptor';
import {ResourceLink} from '../link-object/resource-link';
import {ObjectPropertyImpl} from '../json-property/object/object-property-impl';
import {ResourceObjectProperty} from './resource-object-property';
import {PropertyFactory} from '../json-property/factory/property-factory';
import {NotNull} from '../../decorators/not-null';
import {HalResourceFactory} from './factory/hal-resource-factory';
import {HalProperty} from '../json-property/hal/hal-property';

/**
 * A resource representing a HAL resource with links and - if any - embedded resource objects.
 *
 * @dynamic
 */
export class ResourceObjectPropertyImpl extends ObjectPropertyImpl<HalValueType, ResourceDescriptor> implements ResourceObjectProperty { // TODO: decouple descriptor
  private static LINKS_PROPERTY = '_links';
  private static EMBEDDED_PROPERTY = '_embedded';
  private static METADATA_PROPERTIES = [ResourceObjectPropertyImpl.LINKS_PROPERTY, ResourceObjectPropertyImpl.EMBEDDED_PROPERTY];

  constructor(name: string, resourceObject: HalResourceObject, propertyFactory: PropertyFactory<HalValueType>,
              private resourceFactory: HalResourceFactory,
              private linkFactory: LinkFactory, descriptor: ResourceDescriptor = null) {
    super(name, resourceObject, descriptor, propertyFactory);
  }

  getLinks(): ResourceLink[] {
    return this.linkFactory.getAll();
  }

  getEmbeddedResources(linkRelationType: string, useMainDescriptor: boolean): ResourceObjectProperty[] {
    const embedded = this.getEmbedded(linkRelationType);
    if (Array.isArray(embedded)) {
      return embedded.map(e => this.resourceFactory.create(linkRelationType, e, useMainDescriptor ?
        this.getDescriptorIfAny() : this.getSubResourceDescriptor(linkRelationType)));
    } else {
      throw new Error('Embedded object ' + linkRelationType + ' was not an array as expected');
    }
  }

  getEmbeddedResourceOrNull(linkRelationType: string): ResourceObjectProperty {
    const resource = this.getEmbeddedNullSafe(linkRelationType);
    if (Array.isArray(resource)) {
      return null;
    }
    return resource ? this.resourceFactory.create(linkRelationType, resource, this.getSubResourceDescriptor(linkRelationType)) : undefined;
  }

  getEmbeddedResourcesOrNull(linkRelationType: string): ResourceObjectProperty[] {
    const resources = this.getEmbeddedNullSafe(linkRelationType);
    if (Array.isArray(resources)) {
      const subResourceDescriptor = this.getSubResourceDescriptor(linkRelationType);
      return resources.map(resource => this.resourceFactory.create(linkRelationType, resource, subResourceDescriptor));
    }
    return undefined;
  }

  /**
   * A resource object is always represented as its unique link.
   */
  getFormValue(): string {
    return this.linkFactory.getLink(LinkFactory.SELF_RELATION_TYPE).getFullUriWithoutTemplatedPart();
  }

  getSelfLink(): ResourceLink {
    return this.linkFactory.getLink(LinkFactory.SELF_RELATION_TYPE);
  }

  getOtherLinks(): ResourceLink[] {
    return this.linkFactory.getAll()
      .filter(link => link.getFullUriWithoutTemplatedPart() !== this.getSelfLink().getFullUriWithoutTemplatedPart());
  }

  /**
   * Overrides {@link ObjectPropertyImpl}'s implementation to also return the embedded resource objects.
   */
  getChildProperties(): HalProperty[] {
    const stateKeys = this.getStateKeys();

    const embedded = this.getValue()._embedded;
    const embeddedKeys = embedded ? Object.keys(embedded) : [];

    return stateKeys.map(k => this.getPropertyFactory().create(k, this.getValue()[k])).concat(
      embeddedKeys.map(k => this.getPropertyFactory().createEmbedded(k, embedded[k]))
    );
  }

  /**
   * Overrides {@link ObjectPropertyImpl}'s implementation to also consider embedded resource objects.
   *
   * @return `null` if this resource object contains no child property (but may still have a child descriptor)
   */
  getChildProperty(propertyName: string): HalProperty {
    if (this.getStateKeys().some(k => k === propertyName)) {
      return super.getChildProperty(propertyName);
    }
    const embedded = this.getValue()._embedded;
    if (embedded && embedded[propertyName]) {
      return this.getPropertyFactory().create(propertyName, embedded[propertyName]);
    }
    return null;
  }

  toRawObjectState(): JsonObjectProperty {
    const obj = {};
    Object.keys(this.getValue()).filter(k => this.filterOutMetadata(k)).forEach(k => obj[k] = this.getValue()[k]);
    return new ObjectPropertyImpl(this.getName(), obj, this.getDescriptorIfAny(), this.getPropertyFactory());
  }

  getDisplayValue(): string | number {
    return this.toRawObjectState().getDisplayValue();
  }

  private getEmbeddedNullSafe(linkRelationType: string) {
    return this.getValue()._embedded ? this.getValue()._embedded[linkRelationType] : undefined;
  }

  private getStateKeys() {
    return Object.keys(this.getValue()).filter(key => this.filterOutMetadata(key));
  }

  /**
   * @throws an error if embedded resource does not exist.
   */
  @NotNull((obj, args) => `Embedded object ${args[0]} does not exist.`)
  private getEmbedded(linkRelationType: string): HalResourceObject | HalResourceObject[] {
    return this.getValue()._embedded[linkRelationType];
  }

  private filterOutMetadata(key: string): boolean {
    return !ResourceObjectPropertyImpl.METADATA_PROPERTIES.some(p => p === key);
  }

  private getSubResourceDescriptor(embeddedRelationType: string): ResourceDescriptor {
    return this.getDescriptorIfAny() ? this.getDescriptor().orNull<ObjectPropertyDescriptor, 'getChildDescriptor'>(d =>
      d.getChildDescriptor, embeddedRelationType) as ResourceDescriptor : undefined;
  }
}
