import {ResourceLinks} from './resource-links';
import {EmbeddedResources} from '@hal-navigator/resource-object/embedded-resources';

export type ResourceObject = JsonObject & {
  _embedded?: EmbeddedResources
  _links: ResourceLinks
}

export type JsonType = string | number | boolean | JsonObject | JsonArray

export interface JsonObject {
  [propertyName: string]: JsonType
}

interface JsonArray extends Array<JsonType> {
}
