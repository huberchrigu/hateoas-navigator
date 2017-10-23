import {JsonSchema} from '@hal-navigator/schema/json-schema';

export enum FormFieldType {
  TEXT = 'TEXT', DATE_PICKER = 'DATE_PICKER', ARRAY = 'ARRAY', SUB_FORM = 'SUB_FORM',
  NUMBER = 'NUMBER', INTEGER = 'INTEGER', SELECT = 'SELECT'
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
          return FormFieldType.TEXT;
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
    default:
      throw new Error(type + ' is an unknown property type');
  }
}
