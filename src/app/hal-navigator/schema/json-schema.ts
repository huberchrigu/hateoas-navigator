export interface JsonSchema extends Reference {
  title: string;
  properties?: { [property: string]: JsonSchema }; // for objects
  requiredProperties?: string[]; // for objects
  definitions?: { [definition: string]: JsonSchema }; // for objects
  readOnly?: boolean;
  format?: PropertyFormat;
  type: PropertyType;
  uniqueItems?: boolean;
  items?: Reference; // for arrays
  enum: any[];
}

/**
 * E.g. #/definitions/calendarEntry
 */
export interface Reference {
  $ref: string;
}

export type PropertyType = 'string' | 'array' | 'object' | 'number' | 'integer';
export type PropertyFormat = 'date-time' | 'uri';
