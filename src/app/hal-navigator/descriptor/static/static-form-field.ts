import {FormField} from '@hal-navigator/form/form-field';
import {FormFieldType} from '@hal-navigator/form/form-field-type';
import {FormFieldOptions} from '@hal-navigator/form/form-field-options';
import {StaticPropertyDescriptor} from '@hal-navigator/descriptor/static/static-property-descriptor';
import {DateTimeType} from '@hal-navigator/config/module-configuration';

export class StaticFormField implements FormField {
  name: string;
  type: FormFieldType;
  required: boolean;
  readOnly: boolean;
  title: string;
  options: FormFieldOptions;

  constructor(staticResourceDescriptor: StaticPropertyDescriptor) {
    this.name = staticResourceDescriptor.getName();
    this.options = new FormFieldOptions();
    const type = staticResourceDescriptor.getPropertyConfig().dateTimeType;
    this.options.setDateTimeType(type ? type : DateTimeType.DATE_TIME);
    this.options.setSubFields(staticResourceDescriptor.getChildren().map(c => c.toFormField()));
    this.options.setArraySpec(this);
  }
}
