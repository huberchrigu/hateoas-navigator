import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {JsonSchema} from '@hal-navigator/schema/json-schema';
import {SchemaReferenceFactory} from '@hal-navigator/schema/schema-reference-factory';
import {NotNull} from '../../decorators/not-null';
import {Observable} from 'rxjs/Observable';
import {SchemaService} from '@hal-navigator/resource-services/schema.service';
import {AssociatedResourceListener} from '@hal-navigator/descriptor/association/associated-resource-listener';
import {FormField} from '@hal-navigator/schema/form/form-field';

/**
 * Resolved children needs to be cached, as a {@link JsonSchemaDescriptor} is not stateless ({@link #associatedSchema} is resolved
 * and later used).
 */
export class JsonSchemaDescriptor extends AssociatedResourceListener implements ResourceDescriptor {
  private associatedSchema: JsonSchema;
  private children: { [propertyName: string]: JsonSchemaDescriptor } = {};

  constructor(private name: string, private schema: JsonSchema, private schemaReferenceFactory: SchemaReferenceFactory,
              private schemaService: SchemaService) {
    super();
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
    return undefined;
  }

  getChild(resourceName: string): ResourceDescriptor {
    return this.resolveChild(resourceName);
  }

  getChildren(): Array<ResourceDescriptor> {
    if (!this.schema.properties) {
      return [];
    }
    return Object.keys(this.schema.properties)
      .map(propertyName => this.resolveChild(propertyName));
  }

  resolveAssociation(): Observable<JsonSchemaDescriptor> {
    if (this.schema.format !== 'uri') {
      return null;
    }
    return this.schemaService.getJsonSchema(this.getAssociatedResourceName()).map(associatedSchema => {
      this.associatedSchema = associatedSchema;
      return new JsonSchemaDescriptor(this.getAssociatedResourceName(), associatedSchema,
        new SchemaReferenceFactory(associatedSchema.definitions), this.schemaService);
    });
  }

  getSchema() {
    return this.schema;
  }

  getReferenceFactory() {
    return this.schemaReferenceFactory;
  }

  private resolveChild(propertyName: string): JsonSchemaDescriptor {
    if (this.children[propertyName]) {
      return this.children[propertyName];
    }
    const child = this.resolveProperties()[propertyName];
    if (child) {
      const desc = new JsonSchemaDescriptor(propertyName, child, this.schemaReferenceFactory, this.schemaService);
      this.children[propertyName] = desc;
      return desc;
    } else {
      return null;
    }
  }

  private getAssociatedSchema() {
    if (!this.associatedSchema) {
      throw new Error('Schema for association ' + this.schema.title + ' was not resolved yet');
    }
    return this.associatedSchema;
  }

  @NotNull()
  private resolveProperties() {
    let schema: JsonSchema;
    if (this.schema.type === 'array') {
      schema = this.schema.items;
    } else if (this.schema.type === 'object') {
      schema = this.schema;
    } else if (this.schema.format === 'uri') {
      schema = this.getAssociatedSchema();
    } else {
      throw new Error(`JsonSchema of type ${this.schema.type} has no properties`);
    }
    return this.resolveReference(schema).properties;
  }

  private resolveReference(schema: JsonSchema) {
    return schema.$ref ? this.schemaReferenceFactory.getReferencedSchema(schema) : schema;
  }
}
