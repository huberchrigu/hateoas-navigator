export interface JsonSchema {
  title: string;
  properties?: { [property: string]: JsonSchema }; // for objects
  requiredProperties?: string[]; // for objects
  readOnly?: boolean;
  format?: PropertyFormat;
  type: PropertyType;
  uniqueItems?: boolean; // for arrays
  items?: JsonSchema; // for arrays
  enum: any[];
  $ref: string;
}

export interface JsonSchemaDocument extends JsonSchema {
  definitions?: { [definition: string]: JsonSchema };
}

export type PropertyType = 'string' | 'array' | 'object' | 'number' | 'integer';
export type PropertyFormat = 'date-time' | 'uri';
