import {JsonSchemaDocument} from './json-schema';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {AbstractControl} from '@angular/forms';
import {ItemAdapter} from '@hal-navigator/item/item-adapter';
import {FormFieldFactory} from '@hal-navigator/schema/form/form-field-factory';
import {FormControlFactory} from '@hal-navigator/schema/form/form-control-factory';
import {ItemDescriptor} from '@hal-navigator/config/module-configuration';
import {AlpsDescriptorAdapter} from '@hal-navigator/alp-document/alps-descriptor-adapter';
import {SchemaReferenceFactory} from '@hal-navigator/schema/schema-reference-factory';

export class SchemaAdapter {

  constructor(private schema: JsonSchemaDocument, private alpsDescriptor: AlpsDescriptorAdapter, private descriptor: ItemDescriptor) {
  }

  getSchema() {
    return this.schema;
  }

  getFields(): FormField[] {
    const formFieldFactory = new FormFieldFactory(null, this.schema, true, new SchemaReferenceFactory(this.schema.definitions),
      this.alpsDescriptor, this.descriptor);
    return formFieldFactory.toFormField().options.getSubFields();
  }

  getTitle() {
    return this.schema.title;
  }

  asControls(item?: ItemAdapter): { [key: string]: AbstractControl } {
    return new FormControlFactory(item).getControls(this.getFields());
  }

  getPropertyDescriptor(propertyName: string) {
    return this.descriptor ? this.descriptor[propertyName] : null;
  }

  /**
   * @Deprecated
   */
  getAlpsDescriptorForProperty(propertyName: string) {
    return this.alpsDescriptor.getDescriptors().find(d => d.getName() === propertyName);
  }
}
