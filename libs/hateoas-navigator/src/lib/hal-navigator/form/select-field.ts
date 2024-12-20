import {FormField} from './form-field';
import {FormFieldType} from './form-field-type';

export class SelectField extends FormField {
  constructor(name: string | undefined, required: boolean | undefined, readOnly: boolean | undefined, title: string | undefined, private options: any[] | undefined) {
    super(name, FormFieldType.SELECT, required, readOnly, title);
    if (!this.options || this.options.length < 1) {
      throw new Error('Select field ' + name + ' cannot be created, because select options are missing');
    }
  }

  getOptions(): any[] {
    return this.options!;
  }
}
