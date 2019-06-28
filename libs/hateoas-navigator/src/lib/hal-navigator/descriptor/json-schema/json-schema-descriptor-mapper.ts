import {JsonSchema} from '../../schema/json-schema';
import {SchemaReferenceFactory} from '../../schema/schema-reference-factory';
import {FormFieldBuilder} from '../../form/form-field-builder';
import {getFormType} from '../../form/form-field-type';
import {DescriptorMapper} from 'hateoas-navigator/hal-navigator/descriptor/mapper/descriptor-mapper';
import {DescriptorBuilder, DescriptorType} from 'hateoas-navigator/hal-navigator/descriptor/mapper/descriptor-builder';
import {LOGGER} from 'hateoas-navigator/logging/logger';

export class JsonSchemaDescriptorMapper extends DescriptorMapper<NamedJsonSchema> {

  constructor(private name: string, private schema: JsonSchema, protected schemaReferenceFactory: SchemaReferenceFactory,
              private required = true) {
    super();
    if (!this.schema) {
      throw new Error('A JsonSchema for ' + name + ' is expected');
    }
  }

  map(builder: DescriptorBuilder<NamedJsonSchema>) {
    builder.withName(this.name)
      .withType(this.getType())
      .withTitle(this.getTitle())
      .withChildren(this.getChildrenDescriptors())
      .withArrayItems(this.getArrayItemsDescriptor())
      .withFieldProcessor(field => this.addFormFieldDetails(field))
      .withBuilder((named) => new JsonSchemaDescriptorMapper(named.name, named.schema, this.schemaReferenceFactory,
        this.getRequiredProperties().some(p => p === named.name)));
  }

  private getTitle(): string {
    return this.schema.title;
  }

  private getChildrenDescriptors(): Array<NamedJsonSchema> {
    const children = this.getProperties();
    if (!children) {
      return null;
    }
    return Object.keys(children)
      .map(propertyName => new NamedJsonSchema(propertyName, children[propertyName]));
  }

  /**
   * Keep the array property's name.
   */
  private getArrayItemsDescriptor(): NamedJsonSchema {
    if (!this.schema.items) {
      return null;
    }
    return new NamedJsonSchema(this.name, this.resolveReference(this.schema.items));
  }

  private getType(): DescriptorType {
    switch (this.schema.type) {
      case 'boolean':
      case 'integer':
      case'number':
        return 'primitive';
      case 'array':
        return 'array';
      case 'object':
        return 'object';
      case 'string':
        return this.schema.format === 'uri' ? 'association' : 'primitive';
      default:
        LOGGER.warn('Unknown type ' + this.schema.type);
        return undefined;
    }
  }

  /**
   * Never null/undefined.
   */
  private getRequiredProperties(): Array<string> {
    const result = this.resolveReference(this.schema).requiredProperties;
    return result ? result : [];
  }

  private addFormFieldDetails(formFieldBuilder: FormFieldBuilder) {
    return formFieldBuilder
      .withType(getFormType(this.schema))
      .withRequired(this.required)
      .withReadOnly(this.schema.readOnly)
      .withTitle(this.getTitle())
      .withOptions(this.schema.enum);
  }

  private getProperties(): { [propertyName: string]: JsonSchema } {
    if (this.schema.type !== 'object') {
      return null;
    }
    return this.resolveReference(this.schema).properties;
  }

  private resolveReference(schema: JsonSchema): JsonSchema {
    return schema.$ref ? this.schemaReferenceFactory.getReferencedSchema(schema) : schema;
  }

}

class NamedJsonSchema {
  constructor(public name, public schema: JsonSchema) {
  }
}
