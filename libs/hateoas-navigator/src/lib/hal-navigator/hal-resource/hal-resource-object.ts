import {ResourceLinks} from './resource-links';
import {EmbeddedResources} from './embedded-resources';

export type HalResourceObject = JsonObject & {
  _embedded?: EmbeddedResources // TODO: Every JSON object can have _embedded too (at least in Spring Data REST)
  _links: ResourceLinks
};

export type JsonType = string | number | boolean | JsonObject | JsonArray;

export interface JsonObject {
  [propertyName: string]: JsonType;
}

export interface JsonArray extends Array<JsonType> {
}
