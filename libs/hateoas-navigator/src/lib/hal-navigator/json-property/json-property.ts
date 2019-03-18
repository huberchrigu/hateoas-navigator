import {PropDescriptor} from '../descriptor';
import {GenericArrayValueType, GenericObjectValueType, JsonValueType} from "./value-type/json-value-type";

export interface JsonProperty<V> {
  getDisplayValue(): string | number;

  getFormValue(): JsonValueType;

  getDescriptor(): PropDescriptor;

  getName(): string;

  getValue(): V
}

export interface JsonArrayProperty<CHILDREN extends JsonValueType> extends JsonProperty<GenericArrayValueType<CHILDREN>> {
  getArrayItems(): JsonProperty<CHILDREN>[]
}

export interface JsonObjectProperty<CHILDREN extends JsonValueType> extends JsonProperty<GenericObjectValueType<CHILDREN>> {
  getChildProperties(): JsonProperty<CHILDREN>[]

  getChildProperty(propertyName: string): JsonProperty<CHILDREN>;
}

export interface JsonRawObjectProperty extends JsonObjectProperty<JsonValueType> {
}
