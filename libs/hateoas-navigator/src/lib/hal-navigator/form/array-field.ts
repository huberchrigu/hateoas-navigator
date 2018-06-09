import {FormField} from './form-field';
import {FormFieldType} from './form-field-type';

export class ArrayField extends FormField {
  constructor(name: string, required: boolean, readOnly: boolean, title: string, private arraySpec: FormField) {
    super(name, FormFieldType.ARRAY, required, readOnly, title);
    if (!arraySpec) {
      throw new Error('Cannot create array field ' + name + ' without a specification of its array item fields');
    }
  }

  getArraySpec(): FormField {
    return this.arraySpec;
  }
}
