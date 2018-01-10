import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {JsonSchema} from 'app/hal-navigator/schema/json-schema';
import {SchemaReferenceFactory} from 'app/hal-navigator/schema/schema-reference-factory';
import {AbstractPropertyDescriptor} from '@hal-navigator/descriptor/abstract-property-descriptor';
import {getFormType} from '@hal-navigator/form/form-field-type';
import {FormFieldBuilder} from '@hal-navigator/form/form-field-builder';

/**
 * Resolved children needs to be cached, as a {@link JsonSchemaDescriptor} is not stateless ({@link #associatedSchema} is resolved
 * and later used).
 */
export class JsonSchemaDescriptor extends AbstractPropertyDescriptor {

  private associatedSchema: JsonSchemaDescriptor;

  constructor(name: string, private schema: JsonSchema, private parent: JsonSchemaDescriptor,
              private schemaReferenceFactory: SchemaReferenceFactory) {
    super(name);
    if (!this.schema) {
      throw new Error('A JsonSchema for ' + name + ' is expected');
    }
  }

  getTitle(): string {
    return this.schema.title;
  }

  getChildDescriptor(resourceName: string): PropertyDescriptor {
    if (this.schema.format === 'uri') {
      throw new Error(`Property's association ${this.getName()} is not available`)
    }
    return this.resolveChild(resourceName);
  }

  getChildrenDescriptors(): Array<JsonSchemaDescriptor> {
    const children = this.resolveProperties();
    if (!children) {
      return [];
    }
    return Object.keys(children)
      .map(propertyName => this.resolveChild(propertyName));
  }

  getArrayItemsDescriptor(): JsonSchemaDescriptor {
    if (!this.schema.items) {
      return null;
    }
    return new JsonSchemaDescriptor(null, this.resolveReference(this.schema.items), null, this.getReferenceFactory());
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

  private resolveChild(propertyName: string): JsonSchemaDescriptor {
    const child = this.resolveProperties()[propertyName];
    if (child) {
      return new JsonSchemaDescriptor(propertyName, child, this, this.schemaReferenceFactory);
    } else {
      return null;
    }
  }

  private resolveProperties(): { [propertyName: string]: JsonSchema } {
    if (this.schema.type !== 'object') {
      return null;
    }
    return this.resolveReference(this.schema).properties;
  }

  private resolveReference(schema: JsonSchema): JsonSchema {
    return schema.$ref ? this.schemaReferenceFactory.getReferencedSchema(schema) : schema;
  }
}
