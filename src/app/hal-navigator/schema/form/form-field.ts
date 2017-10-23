import {FormFieldType} from '@hal-navigator/schema/form/form-field-type';
import {FormFieldOptions} from 'app/hal-navigator/schema/form/form-field-options';

export class FormField {
  constructor(public name: string, public type: FormFieldType, public required: boolean, public readOnly: boolean, public title: string,
              public options: FormFieldOptions) {
  }
}
