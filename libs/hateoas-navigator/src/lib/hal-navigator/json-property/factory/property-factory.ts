import {JsonArrayProperty, JsonProperty} from 'libs/hateoas-navigator/src/lib/hal-navigator/json-property/json-property';
import {JsonResourceObject} from 'hateoas-navigator/hal-navigator/hal-resource/resource-object';
import {HalResourceObject} from 'hateoas-navigator/hal-navigator/hal-resource/value-type/hal-value-type';

export interface PropertyFactory<V> {
  create(name: string, value: V): JsonProperty<V>;

  /**
   * Creates a property with knowing that the property is an embedded resource representing an association.
   *
   * @param associationOrArrayOfAssociations Might also be an array of embedded resources.
   */
  createEmbedded(propertyName: string, associationOrArrayOfAssociations: V): JsonResourceObject | JsonArrayProperty<HalResourceObject>;
}
