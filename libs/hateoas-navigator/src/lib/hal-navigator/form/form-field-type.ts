import {JsonSchema} from '../schema/json-schema';

export enum FormFieldType {
  LINK = 'LINK' as any, TEXT = 'TEXT' as any, DATE_PICKER = 'DATE_PICKER' as any, ARRAY = 'ARRAY' as any, SUB_FORM = 'SUB_FORM' as any,
  NUMBER = 'NUMBER' as any, INTEGER = 'INTEGER' as any, SELECT = 'SELECT' as any, BOOLEAN = 'BOOLEAN' as any
}

export function getFormType(propertySchema: JsonSchema): FormFieldType {
  if (propertySchema.enum) {
    return FormFieldType.SELECT;
  }
  const type = propertySchema.type;
  switch (type) {
    case 'string':
      const format = propertySchema.format;
      if (format) {
        if (format === 'date-time') {
          return FormFieldType.DATE_PICKER;
        } else if (format === 'uri') {
          return FormFieldType.LINK;
        } else {
          throw new Error(format + ' is an unknown property format');
        }
      } else {
        return FormFieldType.TEXT;
      }
    case 'array':
      return FormFieldType.ARRAY;
    case 'object':
      return FormFieldType.SUB_FORM;
    case 'number':
      return FormFieldType.NUMBER;
    case 'integer':
      return FormFieldType.INTEGER;
    case 'boolean':
      return FormFieldType.BOOLEAN;
    default:
      throw new Error(type + ' is an unknown property type');
  }
}
