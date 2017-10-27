import {FormField} from '@hal-navigator/schema/form/form-field';
import {getFormType} from '@hal-navigator/schema/form/form-field-type';
import {JsonSchema, Reference} from '@hal-navigator/schema/json-schema';
import {SchemaReferenceFactory} from '@hal-navigator/schema/schema-reference-factory';
import {FormFieldOptions} from '@hal-navigator/schema/form/form-field-options';
import {DateTimeType, ItemDescriptor} from '@hal-navigator/config/module-configuration';

export class FormFieldFactory {
  private schemaReferenceFactory: SchemaReferenceFactory;

  constructor(private requiredProperties: string[], private definitions: { [definition: string]: JsonSchema },
              private descriptor: ItemDescriptor) {
    this.schemaReferenceFactory = new SchemaReferenceFactory(definitions);
  }

  createFormFields(properties: { [name: string]: JsonSchema }): FormField[] {
    return Object.keys(properties).map(key => {
      const property = properties[key];
      return this.createFormField(key, property);
    });
  }

  private createFormField(name: string, property: JsonSchema) {
    return new FormField(name,
      getFormType(property),
      this.requiredProperties ? this.requiredProperties.includes(name) : false,
      property.readOnly,
      property.title,
      this.createOptions(property, this.descriptor ? this.descriptor[name] : null));
  }

  /**
   * This method supports only arrays and objects with a $ref reference.
   */
  private createOptions(property: JsonSchema, descriptor: ItemDescriptor): FormFieldOptions {
    const formFieldOptions = new FormFieldOptions();
    if (property.items) {
      this.setSubFields(formFieldOptions, property.items, descriptor);
    } else if (property.type === 'object') {
      this.setSubFields(formFieldOptions, property, descriptor);
    } else if (property.enum) {
      formFieldOptions.setOptions(property.enum);
    } else if (property.format === 'date-time') {
      formFieldOptions.setDateTimeType(descriptor && descriptor.dateTimeType ? descriptor.dateTimeType : DateTimeType.DATE_TIME);
    }
    return formFieldOptions;
  }

  private setSubFields(formFieldOptions: FormFieldOptions, reference: Reference, descriptor: ItemDescriptor) {
    const referencedSchema = this.schemaReferenceFactory.getReferencedSchema(reference);
    if (referencedSchema.type !== 'object' && referencedSchema.properties) {
      throw new Error('Invalid reference ' + JSON.stringify(reference));
    }
    const children = new FormFieldFactory(referencedSchema.requiredProperties, this.definitions, descriptor)
      .createFormFields(referencedSchema.properties);
    formFieldOptions.setSubFields(children);
  }
}
