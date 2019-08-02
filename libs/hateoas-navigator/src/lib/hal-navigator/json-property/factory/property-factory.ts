import {JsonArrayProperty, JsonProperty} from '../json-property';
import {JsonResourceObject} from '../../hal-resource/json-resource-object';
import {HalResourceObject} from '../../hal-resource/value-type/hal-value-type';

export interface PropertyFactory<V> {
  create(name: string, value: V): JsonProperty<V>;

  /**
   * Creates a property with knowing that the property is an embedded resource representing an association.
   *
   * @param associationOrArrayOfAssociations Might also be an array of embedded resources.
   */
  createEmbedded(propertyName: string, associationOrArrayOfAssociations: V): JsonResourceObject | JsonArrayProperty<HalResourceObject>;
}
