import {JsonSchemaDocument} from './json-schema';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {AbstractControl} from '@angular/forms';
import {VersionedResourceObject} from '@hal-navigator/item/versioned-resource-object';
import {FormFieldFactory} from '@hal-navigator/schema/form/form-field-factory';
import {FormControlFactory} from '@hal-navigator/schema/form/form-control-factory';
import {ItemDescriptor} from '@hal-navigator/config/module-configuration';
import {AlpsDescriptorAdapter} from '@hal-navigator/alp-document/alps-descriptor-adapter';
import {SchemaReferenceFactory} from '@hal-navigator/schema/schema-reference-factory';
import {Observable} from 'rxjs/Observable';
import {HalDocumentService} from '@hal-navigator/hal-document/hal-document.service';
import {ResourceProperty} from '@hal-navigator/resource-object/properties/resource-property';

export class SchemaAdapter {

  constructor(private schema: JsonSchemaDocument, private alpsDescriptor: AlpsDescriptorAdapter, private descriptor: ItemDescriptor,
              private halDocumentService: HalDocumentService) {
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

  asControls(item?: VersionedResourceObject): { [key: string]: AbstractControl } {
    return new FormControlFactory(item).getControls(this.getFields());
  }

  /**
   * @deprecated
   */
  getPropertyDescriptor(property: ResourceProperty) {
    return this.descriptor ? this.descriptor[property.getName()] : null;
  }

  /**
   * @Deprecated
   */
  getAlpsDescriptorForProperty(property: ResourceProperty) {
    return this.alpsDescriptor.getDescriptors().find(d => d.getName() === property.getName());
  }

  resolve(): Observable<SchemaAdapter> {
    if (this.schema.format === 'uri') {
      const name = this.alpsDescriptor.getCollectionResourceName();
      return this.halDocumentService.getJsonSchema(name);
    }
    return Observable.of(this);
  }
}
