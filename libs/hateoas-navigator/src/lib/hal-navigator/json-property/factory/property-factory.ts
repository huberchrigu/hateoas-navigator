import {ResourceObjectProperty} from '../../hal-resource/resource-object-property';
import {GenericPropertyDescriptor} from '../../descriptor/generic-property-descriptor';
import {GenericProperty} from '../generic-property';
import {JsonArrayProperty} from '../array/array-property';

export interface PropertyFactory<V> {
  create(name: string, value: V): GenericProperty<V, GenericPropertyDescriptor>;

  /**
   * Creates a property with knowing that the property is an embedded resource representing an association.
   *
   * @param associationOrArrayOfAssociations Might also be an array of embedded resources.
   */
  createEmbedded(propertyName: string, associationOrArrayOfAssociations: V): ResourceObjectProperty | JsonArrayProperty;
}
