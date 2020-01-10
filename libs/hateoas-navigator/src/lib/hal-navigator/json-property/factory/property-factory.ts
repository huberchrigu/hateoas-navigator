import {JsonResourceObject} from '../../hal-resource/json-resource-object';
import {PropDescriptor} from '../../descriptor/prop-descriptor';
import {GenericProperty} from '../generic-property';
import {JsonArrayProperty} from '../array/array-property';

export interface PropertyFactory<V> {
  create(name: string, value: V): GenericProperty<V, PropDescriptor>;

  /**
   * Creates a property with knowing that the property is an embedded resource representing an association.
   *
   * @param associationOrArrayOfAssociations Might also be an array of embedded resources.
   */
  createEmbedded(propertyName: string, associationOrArrayOfAssociations: V): JsonResourceObject | JsonArrayProperty;
}
