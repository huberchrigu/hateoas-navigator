import {FormField} from '@hal-navigator/schema/form/form-field';
import {getFormType} from '@hal-navigator/schema/form/form-field-type';
import {JsonSchema} from '@hal-navigator/schema/json-schema';
import {SchemaReferenceFactory} from '@hal-navigator/schema/schema-reference-factory';
import {FormFieldOptions} from '@hal-navigator/schema/form/form-field-options';
import {DateTimeType, ItemDescriptor} from '@hal-navigator/config/module-configuration';
import {AlpsDescriptorAdapter} from '@hal-navigator/alp-document/alps-descriptor-adapter';

/**
 * Creates a form field from a JSON schema. A schema of type 'object' has sub-schemas, i.e. this will lead to recursive creations of the
 * sub-schemas' factories.
 *
 * @deprecated
 */
export class FormFieldFactory {

  constructor(private fieldName: string, private schema: JsonSchema, private required: boolean,
              private schemaReferenceFactory: SchemaReferenceFactory,
              private alpsDescriptor: AlpsDescriptorAdapter, private descriptor: ItemDescriptor) {
  }

  toFormField(): FormField {
    if (this.isReference()) {
      const referencedSchema = this.schemaReferenceFactory.getReferencedSchema(this.schema);
      return this.withReplacedSchema(referencedSchema).toFormField();
    }
    return this.createFormField();
  }

  private createFormField(): FormField {
    return new FormField(this.fieldName, getFormType(this.schema), // TODO: Can be done directly in descriptors
      this.required, // TODO: Enable getParent() function in descriptors, then this can be done directly there.
      this.schema.readOnly, // TODO: Can be done directly in descriptors
      this.schema.title, // TODO: Can be done directly in descriptors
      this.createOptions());
  }

  /**
   * This method supports only arrays and objects with a $ref reference.
   */
  private createOptions(): FormFieldOptions {
    const formFieldOptions = new FormFieldOptions();
    switch (this.schema.type) {
      case 'array':
        formFieldOptions.setArraySpec(this.getArraySpec());
        break;
      case 'object':
        formFieldOptions.setSubFields(this.getSubFieldsForObject());
        break;
      default:
        formFieldOptions.setOptions(this.schema.enum); // TODO: Can be done directly in descriptor
        switch (this.schema.format) {
          case 'date-time':
            formFieldOptions.setDateTimeType(this.getDateTimeType()); // TODO: Can be done directly in descriptor
            break;
          case 'uri':
            formFieldOptions.setLinkedResource(this.getLinkedResource()); // TODO: Can be done directly in descriptor
            break;
        }
    }
    return formFieldOptions;
  }

  /**
   * Computes the sub-fields for an 'object' type.
   */
  private getSubFieldsForObject(): FormField[] {
    if (!this.schema.properties) {
      throw new Error('A object needs properties, but " + this.fieldName + " has not');
    }
    return Object.keys(this.schema.properties).map(propertyName => this.createNewFactory(
      propertyName,
      this.schema.properties[propertyName],
      this.schema.requiredProperties.includes(propertyName),
      this.alpsDescriptor ? this.alpsDescriptor.getDescriptors().find(d => d.getName() === propertyName) : null,
      this.descriptor ? this.descriptor[propertyName] : null)
      .toFormField());
  }

  private isReference(): boolean {
    return !!this.schema.$ref;
  }

  private getDateTimeType() {
    return this.descriptor && this.descriptor.dateTimeType ?
      this.descriptor.dateTimeType : DateTimeType.DATE_TIME;
  }

  private getLinkedResource() {
    if (!this.alpsDescriptor) {
      throw new Error(`Unknown collection resource name for URI typed ${this.fieldName} because alps descriptor was not found.`)
    }
    return this.alpsDescriptor.getCollectionResourceName();
  }

  private getArraySpec(): FormField {
    if (!this.schema.items) {
      throw new Error(`${this.fieldName} is an array without 'items' property.`);
    }
    return this.createNewFactoryForArrayItems()
      .toFormField();
  }

  private withReplacedSchema(otherSchema: JsonSchema) {
    return this.createNewFactory(this.fieldName,
      otherSchema,
      this.required,
      this.alpsDescriptor,
      this.descriptor);
  }

  private createNewFactoryForArrayItems() {
    return this.createNewFactory(this.fieldName, this.schema.items, true, this.alpsDescriptor, this.descriptor);
  }

  private createNewFactory(fieldName: string, jsonSchema: JsonSchema, required: boolean,
                           alpsDescriptor: AlpsDescriptorAdapter, descriptor: ItemDescriptor): FormFieldFactory {
    return new FormFieldFactory(fieldName,
      jsonSchema,
      required,
      this.schemaReferenceFactory,
      alpsDescriptor,
      descriptor);
  }
}
