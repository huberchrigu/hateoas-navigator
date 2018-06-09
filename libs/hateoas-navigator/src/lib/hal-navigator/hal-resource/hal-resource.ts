import {ResourceLinks} from './resource-links';
import {EmbeddedResources} from './embedded-resources';

export type HalResource = JsonObject & {
  _embedded?: EmbeddedResources
  _links: ResourceLinks
};

export type JsonType = string | number | boolean | JsonObject | JsonArray;

export interface JsonObject {
  [propertyName: string]: JsonType;
}

export interface JsonArray extends Array<JsonType> {
}
