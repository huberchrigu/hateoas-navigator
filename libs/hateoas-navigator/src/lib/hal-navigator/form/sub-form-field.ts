import {FormField} from './form-field';
import {FormFieldType} from './form-field-type';

export class SubFormField extends FormField {
  constructor(name: string, required: boolean, readOnly: boolean, title: string, private subFields: FormField[]) {
    super(name, FormFieldType.SUB_FORM, required, readOnly, title);
    if (!subFields || subFields.length < 1) {
      throw new Error('FormField ' + name + ' has no sub-fields');
    }
  }

  getSubFields(): FormField[] {
    return this.subFields;
  }
}
