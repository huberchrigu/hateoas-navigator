import {ResourceLinks} from './resource-links';
import {EmbeddedResources} from './embedded-resources';
import {
  GenericArrayValueType,
  GenericObjectValueType,
  JsonValueType
} from '../../json-property/value-type/json-value-type';

/**
 * {@link JsonValueType JSON types} plus HAL {@link HalResourceObject resource objects}.
 */
export type HalValueType = HalResourceObject | HalObject | HalArray | JsonValueType;

export type HalResourceObject = HalObject & {
  _embedded?: EmbeddedResources
  _links?: ResourceLinks
};

export interface HalObject extends GenericObjectValueType<HalValueType> {
}

export interface HalArray extends GenericArrayValueType<HalValueType> {
}
