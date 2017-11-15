import {FormField} from '@hal-navigator/schema/form/form-field';
import {DateTimeType} from '@hal-navigator/config/module-configuration';
import {NotNull} from '../../../decorators/not-null';

export class FormFieldOptions {
  private formFields: FormField[];
  private options: any[];
  private dateTimeType: DateTimeType;
  private linkedResource: string;
  private arraySpec: FormField;

  setSubFields(formFields: FormField[]) {
    this.formFields = formFields;
  }

  @NotNull()
  getSubFields(): FormField[] {
    return this.formFields;
  }

  setOptions(options: any[]) {
    this.options = options;
  }

  @NotNull()
  getOptions() {
    return this.options;
  }

  setDateTimeType(dateTimeType: DateTimeType) {
    this.dateTimeType = dateTimeType;
  }

  @NotNull()
  getDateTimeType() {
    return this.dateTimeType;
  }

  setLinkedResource(linkedResource: string) {
    this.linkedResource = linkedResource;
  }

  @NotNull()
  getLinkedResource(): string {
    return this.linkedResource;
  }

  setArraySpec(arraySpec: FormField) {
    this.arraySpec = arraySpec;
  }

  @NotNull()
  getArraySpec() {
    return this.arraySpec;
  }
}
