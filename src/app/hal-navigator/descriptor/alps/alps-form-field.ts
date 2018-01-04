import {FormField} from '@hal-navigator/form/form-field';
import {AlpsPropertyDescriptor} from '@hal-navigator/descriptor/alps/alps-property-descriptor';
import {FormFieldType} from '@hal-navigator/form/form-field-type';
import {FormFieldOptions} from '@hal-navigator/form/form-field-options';

export class AlpsFormField implements FormField {
  name: string;
  type: FormFieldType;
  required: boolean;
  readOnly: boolean;
  title: string;
  options: FormFieldOptions;

  constructor(alpsResourceDescriptor: AlpsPropertyDescriptor) {
    this.name = alpsResourceDescriptor.getName();
    this.options = new FormFieldOptions();
    this.options.setLinkedResource(alpsResourceDescriptor.resolveAssociatedResourceName());
    this.options.setSubFields(alpsResourceDescriptor.getChildren().map(d => d.toFormField()));
    this.options.setArraySpec(this);
  }
}
