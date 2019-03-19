/**
 * A simple representation of JSON data types.
 */
export type JsonValueType = PrimitiveValueType | ObjectValueType | ArrayValueType;

export type PrimitiveValueType = string | number | boolean;

export interface GenericObjectValueType<CHILDREN extends JsonValueType> {
  [propertyName: string]: CHILDREN;
}

export interface ObjectValueType extends GenericObjectValueType<JsonValueType> {
}

export interface GenericArrayValueType<CHILDREN extends JsonValueType> extends Array<CHILDREN> {
}

export interface ArrayValueType extends GenericArrayValueType<JsonValueType> {
}
