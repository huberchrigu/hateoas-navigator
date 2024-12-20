import {ResourceObjectDescriptor} from '../descriptor';
import {LinkFactory} from '../link-object/link-factory';
import {HalObject, HalResourceObject, HalValueType} from './value-type';
import {JsonObjectProperty} from '../json-property';
import {ResourceLink} from '../link-object';
import {ObjectPropertyImpl} from '../json-property/object/object-property-impl';
import {ResourceObjectProperty} from './resource-object-property';
import {PropertyFactory} from '../json-property/factory/property-factory';
import {NotNull} from '../../decorators/not-null';
import {HalResourceFactory} from './factory/hal-resource-factory';
import {HalProperty} from '../json-property';
import {ResourceObjectFactory} from './resource-object-factory';

/**
 * A resource representing a HAL resource with links and - if any - embedded resource objects.
 *
 * @dynamic
 */
export class ResourceObjectPropertyImpl extends ObjectPropertyImpl<HalValueType, ResourceObjectDescriptor>
  implements ResourceObjectProperty {

  private static LINKS_PROPERTY = '_links';
  private static EMBEDDED_PROPERTY = '_embedded';
  private static METADATA_PROPERTIES = [ResourceObjectPropertyImpl.LINKS_PROPERTY, ResourceObjectPropertyImpl.EMBEDDED_PROPERTY];

  private resourceFactory: ResourceObjectFactory;

  constructor(name: string, resourceObject: HalResourceObject | null, propertyFactory: PropertyFactory<HalValueType>,
              resourceFactory: HalResourceFactory,
              private linkFactory: LinkFactory, descriptor: ResourceObjectDescriptor | null = null) {
    super(name, resourceObject, descriptor, propertyFactory);
    this.resourceFactory = new ResourceObjectFactory(resourceFactory, this.getDescriptorIfAny()!);
  }

  getLinks(): ResourceLink[] {
    return this.linkFactory.getAll();
  }

  /**
   * @return An empty array, if the resource object has no _embedded object or if the _embedded object has the right key with empty value.
   */
  getEmbeddedResources(linkRelationType: string, useMainDescriptor: boolean): ResourceObjectProperty[] {
    if (!this.getValue()!['_embedded']) {
      return [];
    }
    const embedded = this.getEmbedded(linkRelationType);
    if (Array.isArray(embedded)) {
      return embedded.map(resource =>
        this.resourceFactory.createResourceObjectProperty(linkRelationType, resource, useMainDescriptor));
    } else {
      throw new Error('Embedded object ' + linkRelationType + ' was not an array as expected');
    }
  }

  getEmbeddedResourceOrNull(linkRelationType: string): ResourceObjectProperty | null {
    const resource = this.getEmbeddedNullSafe(linkRelationType);
    if (Array.isArray(resource)) {
      return null;
    }
    return resource ?
      this.resourceFactory.createResourceObjectProperty(linkRelationType, resource as HalResourceObject, false) :
      undefined;
  }

  getEmbeddedResourcesOrNull(linkRelationType: string): ResourceObjectProperty[] | undefined {
    const resources = this.getEmbeddedNullSafe(linkRelationType);
    if (Array.isArray(resources)) {
      return resources.map(resource =>
        this.resourceFactory.createResourceObjectProperty(linkRelationType, resource as HalResourceObject, false));
    }
    return undefined;
  }

  /**
   * A resource object is always represented as its unique link.
   *
   * @throws Error if there is no {@link getSelfLink self link}.
   */
  override getFormValue(): string {
    const link = this.linkFactory.getLink(LinkFactory.SELF_RELATION_TYPE);
    if (!link) {
      throw new Error(`Cannot get form value for resource object  ${this.getName()} -> self link is required?`);
    }
    return link.toAbsoluteLink().getUri();
  }

  /**
   * May be <code>undefined</code>.
   */
  getSelfLink(): ResourceLink {
    return this.linkFactory.getLink(LinkFactory.SELF_RELATION_TYPE);
  }

  getOtherLinks(): ResourceLink[] {
    const all = this.linkFactory.getAll();
    if (this.getSelfLink()) {
      return all.filter(link => link.toAbsoluteLink() !== this.getSelfLink().toAbsoluteLink());
    } else {
      return all;
    }
  }

  /**
   * Overrides {@link ObjectPropertyImpl}'s implementation to also return the embedded resource objects.
   */
  override getChildProperties(): HalProperty[] {
    const stateKeys = this.getStateKeys();

    const embedded = this.getEmbeddedObject();
    const embeddedKeys = embedded ? Object.keys(embedded) : [];

    return stateKeys.map(k => this.getPropertyFactory().create(k, this.getValue()![k])).concat(
      embeddedKeys.map(k => this.getPropertyFactory().createEmbedded(k, embedded![k]))
    );
  }

  /**
   * Overrides {@link ObjectPropertyImpl}'s implementation to also consider embedded resource objects.
   *
   * @return `null` if this resource object contains no child property (but may still have a child descriptor)
   */
  override getChildProperty(propertyName: string): HalProperty | null {
    if (this.getStateKeys().some(k => k === propertyName)) {
      return super.getChildProperty(propertyName);
    }
    const embedded = this.getEmbeddedObject();
    if (embedded && embedded[propertyName]) {
      return this.getPropertyFactory().create(propertyName, embedded[propertyName]);
    }
    return null;
  }

  toRawObjectState(): JsonObjectProperty {
    const obj: { [key: string]: any } = {};
    Object.keys(this.getValue()!).filter(k => this.filterOutMetadata(k)).forEach(k => obj[k] = this.getValue()![k]);
    return new ObjectPropertyImpl(this.getName(), obj, this.getDescriptorIfAny()!, this.getPropertyFactory());
  }

  override getDisplayValue(): number | null | string {
    return this.toRawObjectState().getDisplayValue();
  }

  private getEmbeddedNullSafe(linkRelationType: string) {
    return this.getEmbeddedObject() ? this.getEmbeddedObject()[linkRelationType] : undefined;
  }

  private getStateKeys() {
    return Object.keys(this.getValue()!).filter(key => this.filterOutMetadata(key));
  }

  /**
   * @throws an error if embedded resource does not exist.
   */
  @NotNull((obj, args) => `Embedded object ${args[0]} does not exist.`)
  private getEmbedded(linkRelationType: string): HalResourceObject | HalResourceObject[] | undefined | null {
    return this.getEmbeddedObject()[linkRelationType] as HalResourceObject | HalResourceObject[];
  }

  private getEmbeddedObject() {
    return this.getValue()!['_embedded'] as HalObject;
  }

  private filterOutMetadata(key: string): boolean {
    return !ResourceObjectPropertyImpl.METADATA_PROPERTIES.some(p => p === key);
  }
}
