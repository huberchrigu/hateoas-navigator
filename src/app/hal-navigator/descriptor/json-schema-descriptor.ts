import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {JsonSchema} from '@hal-navigator/schema/json-schema';
import {SchemaReferenceFactory} from '@hal-navigator/schema/schema-reference-factory';

export class JsonSchemaDescriptor implements ResourceDescriptor {
  constructor(private name: string, private schema: JsonSchema, private schemaReferenceFactory: SchemaReferenceFactory) {
  }

  getTitle(): string {
    return this.schema.title;
  }

  getName(): string {
    return this.name;
  }

  getChild(resourceName: string): ResourceDescriptor {
    return this.schema.properties ? this.resolveChild(resourceName) : undefined;
  }

  getChildren(): Array<ResourceDescriptor> {
    return this.schema.properties ?
      Object.keys(this.schema.properties)
        .map(propertyName => this.resolveChild(propertyName))
      : undefined;
  }

  private resolveChild(propertyName: string): JsonSchemaDescriptor {
    const child = this.schema.properties[propertyName];
    if (child) {
      const schema = child.$ref ? this.schemaReferenceFactory.getReferencedSchema(child) : child;
      return new JsonSchemaDescriptor(propertyName, schema, this.schemaReferenceFactory);
    } else {
      return null;
    }
  }
}
