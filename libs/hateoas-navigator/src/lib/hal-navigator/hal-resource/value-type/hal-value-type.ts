import {ResourceLinks} from './resource-links';
import {EmbeddedResources} from './embedded-resources';
import {
  GenericArrayValueType,
  GenericObjectValueType,
  JsonValueType
} from 'libs/hateoas-navigator/src/lib/hal-navigator/json-property/value-type/json-value-type';

export type HalValueType = HalResourceObject | HalObject | HalArray | JsonValueType;

export type HalResourceObject = HalObject & {
  _embedded?: EmbeddedResources
  _links?: ResourceLinks
};

export interface HalObject extends GenericObjectValueType<HalValueType> {
}

export interface HalArray extends GenericArrayValueType<HalValueType> {
}
