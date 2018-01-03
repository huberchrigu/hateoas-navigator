import {FormField} from '@hal-navigator/schema/form/form-field';
import {DateTimeType} from '@hal-navigator/config/module-configuration';

export class FormFieldOptions {
  private formFields: FormField[];
  private options: any[];
  private dateTimeType: DateTimeType;
  private linkedResource: string;
  private arraySpec: FormField;

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

  getDateTimeType(): DateTimeType {
    return this.dateTimeType ? this.dateTimeType : DateTimeType.DATE_TIME;
  }

  setLinkedResource(linkedResource: string) {
    this.linkedResource = linkedResource;
  }

  getLinkedResource(): string {
    return this.linkedResource;
  }

  setArraySpec(arraySpec: FormField) {
    this.arraySpec = arraySpec;
  }

  getArraySpec() {
    return this.arraySpec;
  }
}
