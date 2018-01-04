import {FormField} from '@hal-navigator/form/form-field';
import {FormFieldType} from '@hal-navigator/form/form-field-type';
import {FormFieldOptions} from '@hal-navigator/form/form-field-options';
import {StaticPropertyDescriptor} from '@hal-navigator/descriptor/static/static-property-descriptor';

export class StaticFormField implements FormField {
  name: string;
  type: FormFieldType;
  required: boolean;
  readOnly: boolean;
  title: string;
  options: FormFieldOptions;

  constructor(staticResourceDescriptor: StaticPropertyDescriptor) {
    this.name = staticResourceDescriptor.getName();
    this.options.setDateTimeType(staticResourceDescriptor.getItemDescriptor().dateTimeType);
  }
}
