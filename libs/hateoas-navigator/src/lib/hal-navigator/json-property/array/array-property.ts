import {ArrayPropertyDescriptor, PropDescriptor} from '../../descriptor/prop-descriptor';
import {GenericArrayValueType, JsonValueType} from '../value-type/json-value-type';
import {GenericProperty} from '../generic-property';

/**
 * Describes a property whose value is an array.
 */
export interface ArrayProperty<V extends JsonValueType> extends GenericProperty<GenericArrayValueType<V>, ArrayPropertyDescriptor> {
    /**
     * Provides the array value as an array of their {@link GenericProperty} representation.
     */
    getArrayItems(): GenericProperty<V, PropDescriptor>[];
}

/**
 * An {@link ArrayProperty} whose values can only be of type {@link JsonValueType}.
 */
export interface JsonArrayProperty extends ArrayProperty<JsonValueType> {
}
