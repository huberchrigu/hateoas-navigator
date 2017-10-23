import {JsonSchema} from './json-schema';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {AbstractControl} from '@angular/forms';
import {ItemAdapter} from '@hal-navigator/item/item-adapter';
import {FormFieldFactory} from '@hal-navigator/schema/form/form-field-factory';
import {FormControlFactory} from '@hal-navigator/schema/form/form-control-factory';

export class SchemaAdapter {

  constructor(private schema: JsonSchema) {
  }

  getSchema() {
    return this.schema;
  }

  getFields(): FormField[] {
    const properties = this.schema.properties;
    const requiredProperties = this.schema.requiredProperties;
    const formFieldFactory = new FormFieldFactory(requiredProperties, this.schema.definitions);
    return formFieldFactory.createFormFields(properties);
  }

  getTitle() {
    return this.schema.title;
  }

  asControls(item?: ItemAdapter): { [key: string]: AbstractControl } {
    return new FormControlFactory(item).getControls(this.getFields());
  }
}
