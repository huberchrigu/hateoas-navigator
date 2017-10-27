import {FormField} from '@hal-navigator/schema/form/form-field';
import {DateTimeType} from '@hal-navigator/config/module-configuration';

export class FormFieldOptions {
  private formFields: FormField[];
  private options: any[];
  private dateTimeType: DateTimeType;

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

  setDateTimeType(dateTimeType: DateTimeType) {
    this.dateTimeType = dateTimeType;
  }

  getDateTimeType() {
    return this.dateTimeType;
  }
}
