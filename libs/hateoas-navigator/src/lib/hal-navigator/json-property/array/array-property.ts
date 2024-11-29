import {ArrayDescriptor, GenericPropertyDescriptor} from '../../descriptor';
import {GenericArrayValueType, JsonValueType} from '../value-type';
import {GenericProperty} from '../generic-property';

/**
 * Describes a property whose value is an array.
 */
export interface ArrayProperty<V extends JsonValueType> extends GenericProperty<GenericArrayValueType<V>, ArrayDescriptor> {
  /**
   * Provides the array value as an array of their {@link GenericProperty} representation.
   */
  getArrayItems(): GenericProperty<V, GenericPropertyDescriptor>[];
}

/**
 * An {@link ArrayProperty} whose values can only be of type {@link JsonValueType}.
 */
export interface JsonArrayProperty extends ArrayProperty<JsonValueType> {
}
