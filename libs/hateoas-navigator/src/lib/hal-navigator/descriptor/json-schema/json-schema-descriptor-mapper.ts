import {JsonSchema} from '../../schema/json-schema';
import {SchemaReferenceFactory} from '../../schema/schema-reference-factory';
import {FormFieldBuilder} from '../../form/form-field-builder';
import {getFormType} from '../../form/form-field-type';
import {DescriptorMapper} from 'hateoas-navigator/hal-navigator/descriptor/mapper/descriptor-mapper';
import {DescriptorBuilder} from 'hateoas-navigator/hal-navigator/descriptor/mapper/descriptor-builder';

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
      .withTitle(this.getTitle())
      .withChildren(this.getChildrenDescriptors())
      .withArrayItems(this.getArrayItemsDescriptor())
      .withFieldProcessor(field => this.addFormFieldDetails(field))
      .withBuilder((named) => new JsonSchemaDescriptorMapper(named.name, named.schema, this.schemaReferenceFactory,
        this.getRequiredProperties().some(p => p === this.name)));
  }

  getTitle(): string {
    return this.schema.title;
  }

  getChildrenDescriptors(): Array<NamedJsonSchema> {
    const children = this.getProperties();
    if (!children) {
      return null;
    }
    return Object.keys(children)
      .map(propertyName => new NamedJsonSchema(propertyName, children[propertyName]));
  }

  getArrayItemsDescriptor(): NamedJsonSchema {
    if (!this.schema.items) {
      return null;
    }
    return new NamedJsonSchema(null, this.resolveReference(this.schema.items));
  }

  getSchema() {
    return this.schema;
  }

  /**
   * Never null/undefined.
   */
  getRequiredProperties(): Array<string> {
    const result = this.resolveReference(this.schema).requiredProperties;
    return result ? result : [];
  }

  protected addFormFieldDetails(formFieldBuilder: FormFieldBuilder) {
    return formFieldBuilder
      .withType(getFormType(this.getSchema()))
      .withRequired(this.required)
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

}

class NamedJsonSchema {
  constructor(public name, public schema: JsonSchema) {
  }
}
