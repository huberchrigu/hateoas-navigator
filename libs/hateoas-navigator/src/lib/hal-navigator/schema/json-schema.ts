export interface JsonSchema {
  title?: string;
  properties?: { [property: string]: JsonSchema }; // for objects
  requiredProperties?: string[]; // for objects
  readOnly?: boolean;
  format?: PropertyFormat;
  type: PropertyType;
  uniqueItems?: boolean; // for arrays
  items?: JsonSchema; // for arrays
  enum?: any[];
  $ref?: string;
}

export interface JsonSchemaDocument extends JsonSchema {
  definitions?: JsonSchemaDefinitions;
}

export type PropertyType = 'string' | 'array' | 'object' | 'number' | 'integer' | 'boolean';
export type PropertyFormat = 'date-time' | 'uri';

export interface JsonSchemaDefinitions {
  [definition: string]: JsonSchema;
}
