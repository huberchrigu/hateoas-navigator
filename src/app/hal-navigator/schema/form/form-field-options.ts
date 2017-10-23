import {FormField} from '@hal-navigator/schema/form/form-field';

export class FormFieldOptions {
  private formFields: FormField[];
  private options: any[];

  setSubFields(formFields: FormField[]) {
    this.formFields = formFields;
  }

  getSubFields(): FormField[] {
    return this.formFields;
  }

  setOptions(options: any[]) {
    this.options = options;
  }

  getOptions() {
    return this.options;
  }
}
