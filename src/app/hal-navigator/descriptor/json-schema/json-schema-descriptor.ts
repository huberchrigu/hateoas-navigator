import {ResourceDescriptor} from 'app/hal-navigator/descriptor/resource-descriptor';
import {JsonSchema} from 'app/hal-navigator/schema/json-schema';
import {SchemaReferenceFactory} from 'app/hal-navigator/schema/schema-reference-factory';
import {Observable} from 'rxjs/Observable';
import {SchemaService} from 'app/hal-navigator/resource-services/schema.service';
import {AssociatedResourceListener} from 'app/hal-navigator/descriptor/association/associated-resource-listener';
import {FormField} from 'app/hal-navigator/schema/form/form-field';
import {JsonSchemaFormField} from '@hal-navigator/descriptor/json-schema/json-schema-form-field';

/**
 * Resolved children needs to be cached, as a {@link JsonSchemaDescriptor} is not stateless ({@link #associatedSchema} is resolved
 * and later used).
 */
export class JsonSchemaDescriptor extends AssociatedResourceListener implements ResourceDescriptor {
  private associatedSchema: JsonSchemaDescriptor;
  private children: { [propertyName: string]: JsonSchemaDescriptor } = {};

  constructor(private name: string, private schema: JsonSchema, private parent: JsonSchemaDescriptor,
              private schemaReferenceFactory: SchemaReferenceFactory,
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
    return new JsonSchemaFormField(this, this.schemaService);
  }

  getChild(resourceName: string): ResourceDescriptor {
    if (this.schema.format === 'uri') {
      return this.getAssociatedResource().getChild(resourceName);
    }
    return this.resolveChild(resourceName);
  }

  getChildren(): Array<ResourceDescriptor> {
    const children = this.resolveProperties();
    if (!children) {
      return [];
    }
    return Object.keys(children)
      .map(propertyName => this.resolveChild(propertyName));
  }

  resolveAssociation(): Observable<JsonSchemaDescriptor> {
    if (this.schema.format !== 'uri') {
      return null;
    }
    if (this.associatedSchema) {
      return Observable.of(this.associatedSchema);
    }
    return this.schemaService.getJsonSchema(this.getAssociatedResourceName()).map(associatedSchema => {
      this.associatedSchema = new JsonSchemaDescriptor(this.getAssociatedResourceName(), associatedSchema, null,
        new SchemaReferenceFactory(associatedSchema.definitions), this.schemaService);
      return this.associatedSchema;
    });
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

  getAssociatedResource(): JsonSchemaDescriptor {
    if (!this.associatedSchema) {
      throw new Error('Schema for association ' + this.schema.title + ' was not resolved yet');
    }
    return this.associatedSchema;
  }

  private resolveChild(propertyName: string): JsonSchemaDescriptor {
    if (this.children[propertyName]) {
      return this.children[propertyName];
    }
    const child = this.resolveProperties()[propertyName];
    if (child) {
      const desc = new JsonSchemaDescriptor(propertyName, child, this, this.schemaReferenceFactory, this.schemaService);
      this.children[propertyName] = desc;
      return desc;
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
      // } else if (this.schema.format === 'uri') {
      //   schema = this.getAssociatedSchema();
    } else {
      return null;
    }
    return this.resolveReference(schema).properties;
  }

  private resolveReference(schema: JsonSchema): JsonSchema {
    return schema.$ref ? this.schemaReferenceFactory.getReferencedSchema(schema) : schema;
  }
}
