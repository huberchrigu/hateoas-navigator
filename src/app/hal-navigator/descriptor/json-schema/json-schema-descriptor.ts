import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {JsonSchema} from 'app/hal-navigator/schema/json-schema';
import {SchemaReferenceFactory} from 'app/hal-navigator/schema/schema-reference-factory';
import {FormField} from 'app/hal-navigator/form/form-field';
import {JsonSchemaFormField} from '@hal-navigator/descriptor/json-schema/json-schema-form-field';

/**
 * Resolved children needs to be cached, as a {@link JsonSchemaDescriptor} is not stateless ({@link #associatedSchema} is resolved
 * and later used).
 */
export class JsonSchemaDescriptor implements PropertyDescriptor {
  private associatedSchema: JsonSchemaDescriptor;

  constructor(private name: string, private schema: JsonSchema, private parent: JsonSchemaDescriptor,
              private schemaReferenceFactory: SchemaReferenceFactory) {
    if (!this.schema) {
      throw new Error('A JsonSchema for ' + name + ' is expected');
    }
  }

  getTitle(): string {
    return this.schema.title;
  }

  getName(): string {
    return this.name;
  }

  toFormField(): FormField {
    return new JsonSchemaFormField(this);
  }

  getChild(resourceName: string): PropertyDescriptor {
    if (this.schema.format === 'uri') {
      throw new Error(`Property's association ${this.getName()} is not available`)
    }
    return this.resolveChild(resourceName);
  }

  getChildren(): Array<PropertyDescriptor> {
    const children = this.resolveProperties();
    if (!children) {
      return [];
    }
    return Object.keys(children)
      .map(propertyName => this.resolveChild(propertyName));
  }

  getSchema() {
    return this.schema;
  }

  getReferenceFactory() {
    return this.schemaReferenceFactory;
  }

  getParent() {
    return this.parent;
  }

  getArrayItems() {
    return this.resolveReference(this.schema.items);
  }

  getRequiredProperties() {
    return this.resolveReference(this.schema).requiredProperties;
  }

  getAssociatedResourceName(): string {
    return undefined;
  }

  private resolveChild(propertyName: string): JsonSchemaDescriptor {
    const child = this.resolveProperties()[propertyName];
    if (child) {
      return new JsonSchemaDescriptor(propertyName, child, this, this.schemaReferenceFactory);
    } else {
      return null;
    }
  }

  private resolveProperties(): { [propertyName: string]: JsonSchema } {
    let schema: JsonSchema;
    if (this.schema.type === 'array') {
      schema = this.schema.items;
    } else if (this.schema.type === 'object') {
      schema = this.schema;
    } else {
      return null;
    }
    return this.resolveReference(schema).properties;
  }

  private resolveReference(schema: JsonSchema): JsonSchema {
    return schema.$ref ? this.schemaReferenceFactory.getReferencedSchema(schema) : schema;
  }
}
