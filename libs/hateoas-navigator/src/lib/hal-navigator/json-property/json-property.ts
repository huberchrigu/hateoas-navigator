import {PropDescriptor} from '../descriptor';
import {GenericArrayValueType, GenericObjectValueType, JsonValueType} from './value-type/json-value-type';

export interface JsonProperty<V> {
  getDisplayValue(): string | number;

  getFormValue(): JsonValueType;

  getDescriptor(): PropDescriptor;

  getName(): string;

  getValue(): V;

  hasDescriptor(): boolean;
}

export interface JsonArrayProperty<CHILDREN extends JsonValueType> extends JsonProperty<GenericArrayValueType<CHILDREN>> {
  getArrayItems(): JsonProperty<CHILDREN>[];
}

export interface JsonObjectProperty<CHILDREN extends JsonValueType> extends JsonProperty<GenericObjectValueType<CHILDREN>> {
  /**
   * Gets all children, i.e. for a JSON object {a: ..., b: ...} "a" and "b", for a resource object also the embedded resources.
   */
  getChildProperties(): JsonProperty<CHILDREN>[];

  getChildProperty(propertyName: string): JsonProperty<CHILDREN>;
}

export interface JsonRawObjectProperty extends JsonObjectProperty<JsonValueType> {
}
