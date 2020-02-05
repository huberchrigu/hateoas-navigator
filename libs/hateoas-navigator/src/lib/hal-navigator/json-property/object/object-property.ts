import {GenericObjectValueType, JsonValueType} from '../value-type/json-value-type';
import {GenericProperty} from '../generic-property';
import {ObjectDescriptor, GenericPropertyDescriptor} from '../../descriptor/generic-property-descriptor';

/**
 * A property whose value is an object (key/value map).
 */
export interface ObjectProperty<V extends JsonValueType> extends GenericProperty<GenericObjectValueType<V>, ObjectDescriptor> {
  /**
   * Gets all children, i.e. for a JSON object {a: ..., b: ...} "a" and "b", for a resource object also the embedded resources.
   */
  getChildProperties(): GenericProperty<V, GenericPropertyDescriptor>[];

  getChildProperty(propertyName: string): GenericProperty<V, GenericPropertyDescriptor>;
}

/**
 * An {@link ObjectProperty} whose object values are only of type {@link JsonValueType}.
 */
export interface JsonObjectProperty extends ObjectProperty<JsonValueType> {
}
