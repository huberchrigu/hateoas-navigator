import {FormField} from '@hal-navigator/form/form-field';
import {JsonSchemaDescriptor} from '@hal-navigator/descriptor/json-schema/json-schema-descriptor';
import {FormFieldType, getFormType} from '@hal-navigator/form/form-field-type';
import {FormFieldOptions} from '@hal-navigator/form/form-field-options';
import {SchemaService} from '@hal-navigator/resource-services/schema.service';

export class JsonSchemaFormField implements FormField {
  name: string;
  type: FormFieldType;
  required: boolean;
  readOnly: boolean;
  title: string;
  options: FormFieldOptions;

  constructor(private jsonSchemaDescriptor: JsonSchemaDescriptor, schemaService: SchemaService) {
    this.name = jsonSchemaDescriptor.getName();
    this.type = getFormType(this.jsonSchemaDescriptor.getSchema());
    this.required = this.jsonSchemaDescriptor.getParent() ?
      this.jsonSchemaDescriptor.getParent().getRequiredProperties().some(required => required === this.name) : true;
    this.readOnly = jsonSchemaDescriptor.getSchema().readOnly;
    this.title = jsonSchemaDescriptor.getTitle();
    this.options = new FormFieldOptions();
    this.options.setOptions(this.jsonSchemaDescriptor.getSchema().enum);
    if (this.type === FormFieldType.SUB_FORM) {
      this.options.setSubFields(this.jsonSchemaDescriptor.getChildren().map(c => c.toFormField()));
    } else if (this.type === FormFieldType.ARRAY) {
      this.options.setArraySpec(new JsonSchemaDescriptor(this.name, this.jsonSchemaDescriptor.getArrayItems(), null,
        this.jsonSchemaDescriptor.getReferenceFactory(), schemaService).toFormField());
    }
  }
}
