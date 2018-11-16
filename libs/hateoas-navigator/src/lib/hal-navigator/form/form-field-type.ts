import {JsonSchema} from '../schema/json-schema';

export enum FormFieldType {
  LINK = <any> 'LINK', TEXT = <any> 'TEXT', DATE_PICKER = <any> 'DATE_PICKER', ARRAY = <any> 'ARRAY', SUB_FORM = <any> 'SUB_FORM',
  NUMBER = <any> 'NUMBER', INTEGER = <any> 'INTEGER', SELECT = <any> 'SELECT', BOOLEAN = <any> 'BOOLEAN'
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
