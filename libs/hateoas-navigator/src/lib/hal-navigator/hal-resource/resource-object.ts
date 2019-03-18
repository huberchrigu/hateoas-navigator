import {JsonObjectProperty, JsonProperty, JsonRawObjectProperty} from '../../hal-navigator/json-property/json-property';
import {HalValueType} from '../../hal-navigator/hal-resource/value-type/hal-value-type';
import {JsonValueType} from '../json-property/value-type/json-value-type';
import {ResourceDescriptor} from '../descriptor/resource-descriptor';
import {ResourceLink} from '../link-object/resource-link';

export interface JsonResourceObject extends JsonObjectProperty<HalValueType> {
  toRawObject(): JsonRawObjectProperty;

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
   * @return The resource state plus the embedded resources' state.
   */
  getPropertiesAndEmbeddedResourcesAsProperties(): JsonProperty<JsonValueType>[];

  getDescriptor(): ResourceDescriptor;

  getLinks(): ResourceLink[];

  getSelfLink(): ResourceLink;
}

export interface VersionedJsonResourceObject extends JsonResourceObject {
  getVersion(): string;
}
