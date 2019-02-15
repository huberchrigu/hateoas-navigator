import {AbstractPropertyDescriptor} from '../abstract-property-descriptor';
import {JsonSchema} from '../../schema/json-schema';
import {SchemaReferenceFactory} from '../../schema/schema-reference-factory';
import {FormFieldBuilder} from '../../form/form-field-builder';
import {getFormType} from '../../form/form-field-type';
import {JsonSchemaResourceDescriptor} from './json-schema-resource-descriptor';
import {DeprecatedResourceDescriptor} from '../deprecated-resource-descriptor';
import {LOGGER} from 'hateoas-navigator/logging/logger';

export class JsonSchemaDescriptor extends AbstractPropertyDescriptor {

  constructor(name: string, private schema: JsonSchema, private parent: JsonSchemaDescriptor,
              protected schemaReferenceFactory: SchemaReferenceFactory) {
    super(name);
    if (!this.schema) {
      throw new Error('A JsonSchema for ' + name + ' is expected');
    }
  }

  getTitle(): string {
    return this.schema.title;
  }

  getChildDescriptor(propertyName: string): JsonSchemaResourceDescriptor {
    if (this.schema.format === 'uri') {
      throw new Error(`Property's association ${this.getName()} is not available`)
    }
    const child = this.getProperties()[propertyName];
    if (child) {
      return this.toDescriptor(propertyName, child);
    } else {
      return null;
    }
  }

  getChildResourceDesc(childResource: string): DeprecatedResourceDescriptor {
    const properties = this.getProperties();
    if (!properties) {
      LOGGER.warn('Descriptor has no child properties: ' + JSON.stringify(this));
      return null;
    }
    const child = properties[childResource];
    return child ? new JsonSchemaResourceDescriptor(childResource, child, this, this.schemaReferenceFactory) : null;
  }

  getChildrenDescriptors(): Array<JsonSchemaResourceDescriptor> {
    const children = this.getProperties();
    if (!children) {
      return [];
    }
    return Object.keys(children)
      .map(propertyName => this.toDescriptor(propertyName, children[propertyName]));
  }

  getArrayItemsDescriptor(): JsonSchemaResourceDescriptor {
    if (!this.schema.items) {
      return null;
    }
    return new JsonSchemaResourceDescriptor(null, this.resolveReference(this.schema.items), null, this.getReferenceFactory());
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

  /**
   * Never null/undefined.
   */
  getRequiredProperties(): Array<string> {
    const result = this.resolveReference(this.schema).requiredProperties;
    return result ? result : [];
  }

  getAssociatedResourceName(): string {
    return undefined;
  }

  protected addFormFieldDetails(formFieldBuilder: FormFieldBuilder) {
    formFieldBuilder
      .withType(getFormType(this.getSchema()))
      .withRequired(this.getParent() ?
        this.getParent().getRequiredProperties().some(required => required === this.getName()) : true)
      .withReadOnly(this.getSchema().readOnly)
      .withTitle(this.getTitle())
      .withOptions(this.getSchema().enum);
  }

  protected getProperties(): { [propertyName: string]: JsonSchema } {
    if (this.schema.type !== 'object') {
      return null;
    }
    return this.resolveReference(this.schema).properties;
  }

  private resolveReference(schema: JsonSchema): JsonSchema {
    return schema.$ref ? this.schemaReferenceFactory.getReferencedSchema(schema) : schema;
  }

  private toDescriptor(propertyName: string, schema: JsonSchema) {
    return new JsonSchemaResourceDescriptor(propertyName, schema, this, this.schemaReferenceFactory);
  }
}
