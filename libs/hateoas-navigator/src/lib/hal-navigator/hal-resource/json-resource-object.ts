import {ObjectProperty, JsonObjectProperty} from '../json-property/object/object-property';
import {HalValueType} from './value-type/hal-value-type';
import {ResourceDescriptor} from '../descriptor/resource-descriptor';
import {ResourceLink} from '../link-object/resource-link';


/**
 * The same same as a {@link JsonObjectProperty plain old JSON object}, but contains embedded resources and links.
 */
export interface JsonResourceObject extends ObjectProperty<HalValueType> {
  /**
   * Removes embedded resources.
   */
  toRawObjectState(): JsonObjectProperty;

  /**
   * Use this function to retrieve all resource objects of a collection resource.
   *
   * @param useMainDescriptor Use this resource object's descriptor if true. Otherwise a child resource descriptor is resolved.
   * @param linkRelationType The name of the embedded resources.
   *
   * @return An array of resource objects.
   *
   * @throws an error if not an array
   */
  getEmbeddedResources(linkRelationType: string, useMainDescriptor: boolean): JsonResourceObject[];

  /**
   * Checks whether the given embedded resource exists and is not an array. If so, the resource is returned.
   *
   * @param linkRelationType The embedded resource name.
   *
   * @return null if it does not exist or if it is an array.
   */
  getEmbeddedResourceOrNull(linkRelationType: string): JsonResourceObject;

  /**
   * Like {@link getEmbeddedResourceOrNull}, but returns null if the embedded is not an array.
   */
  getEmbeddedResourcesOrNull(linkRelationType: string): JsonResourceObject[];

  getDescriptor(): ResourceDescriptor; // TODO: Remove from resource object

  getLinks(): ResourceLink[];

  getSelfLink(): ResourceLink;

  /**
   * {@link getLinks All links} minus the ones {@link getSelfLink pointing to itself}.
   */
  getOtherLinks(): ResourceLink[];
}

export interface VersionedJsonResourceObject extends JsonResourceObject {
  getVersion(): string;
}
