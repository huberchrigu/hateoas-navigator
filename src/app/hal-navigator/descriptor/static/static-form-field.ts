import {FormField} from '@hal-navigator/schema/form/form-field';
import {FormFieldType} from '@hal-navigator/schema/form/form-field-type';
import {FormFieldOptions} from '@hal-navigator/schema/form/form-field-options';
import {StaticResourceDescriptor} from '@hal-navigator/descriptor/static/static-resource-descriptor';

export class StaticFormField implements FormField {
  name: string;
  type: FormFieldType;
  required: boolean;
  readOnly: boolean;
  title: string;
  options: FormFieldOptions;

  constructor(staticResourceDescriptor: StaticResourceDescriptor) {
    this.name = staticResourceDescriptor.getName();
    this.options.setDateTimeType(staticResourceDescriptor.getItemDescriptor().dateTimeType);
  }
}
