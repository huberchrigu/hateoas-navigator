import {FormFieldFactory} from '@hal-navigator/schema/form/form-field-factory';
import {JsonSchema} from '@hal-navigator/schema/json-schema';
import {SchemaReferenceFactory} from '@hal-navigator/schema/schema-reference-factory';
import {AlpsDescriptorAdapter} from '@hal-navigator/alp-document/alps-descriptor-adapter';
import {JsonSchemaDescriptor} from '@hal-navigator/descriptor/json-schema-descriptor';
import {AlpsResourceDescriptor} from '@hal-navigator/descriptor/alps-resource-descriptor';
import {StaticResourceDescriptor} from '@hal-navigator/descriptor/static-resource-descriptor';
import {ItemDescriptor} from '@hal-navigator/config/module-configuration';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';

export class FormFieldFactoryBuilder {
  private fieldName: string;
  private schema: JsonSchema;
  private schemaReferenceFactory: SchemaReferenceFactory;
  private alpsDescriptor: AlpsDescriptorAdapter;
  private itemDescriptor: ItemDescriptor;

  withFieldName(fieldName: string) {
    this.fieldName = fieldName;
  }

  withSchema(schema: JsonSchema) {
    this.schema = schema;
  }

  withSchemaReferenceFactory(schemaReferenceFactory: SchemaReferenceFactory) {
    this.schemaReferenceFactory = schemaReferenceFactory;
  }

  withAlpsDescriptor(alpsDescriptor: AlpsDescriptorAdapter) {
    this.alpsDescriptor = alpsDescriptor;
  }

  withItemDescriptor(descriptor: ItemDescriptor) {
    this.itemDescriptor = descriptor;
  }

  withJsonSchemaDescriptor(jsonSchemaDescriptor: JsonSchemaDescriptor) {
    this.withSchema(jsonSchemaDescriptor.getSchema());
    this.withSchemaReferenceFactory(jsonSchemaDescriptor.getReferenceFactory());
    this.withFieldName(jsonSchemaDescriptor.getName());
  }

  withAlpsResourceDescriptor(alpsResourceDescriptor: AlpsResourceDescriptor) {
    this.withAlpsDescriptor(new AlpsDescriptorAdapter(alpsResourceDescriptor.getAlpsDescriptor()));
    this.withFieldName(alpsResourceDescriptor.getName());
  }

  withStaticResourceDescriptor(staticResourceDescriptor: StaticResourceDescriptor) {
    this.withItemDescriptor(staticResourceDescriptor.getItemDescriptor());
    this.withFieldName(staticResourceDescriptor.getName());
  }

  withResourceDescriptor(resourceDescriptor: ResourceDescriptor) {
    if (resourceDescriptor instanceof AlpsResourceDescriptor) {
      this.withAlpsResourceDescriptor(resourceDescriptor);
    } else if (resourceDescriptor instanceof JsonSchemaDescriptor) {
      this.withJsonSchemaDescriptor(resourceDescriptor);
    } else if (resourceDescriptor instanceof StaticResourceDescriptor) {
      this.withStaticResourceDescriptor(resourceDescriptor);
    } else {
      throw new Error(`${resourceDescriptor.constructor.name} is not a known ResourceDescriptor`);
    }
  }

  build() {
    return new FormFieldFactory(this.fieldName, this.schema, true, this.schemaReferenceFactory, this.alpsDescriptor, this.itemDescriptor);
  }
}
