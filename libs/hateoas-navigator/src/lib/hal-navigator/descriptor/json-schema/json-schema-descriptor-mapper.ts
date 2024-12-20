import {JsonSchema} from '../../schema/json-schema';
import {SchemaReferenceFactory} from '../../schema/schema-reference-factory';
import {FormFieldBuilder} from '../../form';
import {getFormType} from '../../form/form-field-type';
import {DescriptorMapper} from '../mapper/descriptor-mapper';
import {DescriptorBuilder} from '../mapper/descriptor-builder';
import {LOGGER} from '../../../logging';
import {DescriptorType} from '../mapper/internal/descriptor-type';

class NamedJsonSchema {
  constructor(public name: string, public schema: JsonSchema) {
  }
}

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

  private getTitle(): string | undefined {
    return this.schema.title;
  }

  private getChildrenDescriptors(): Array<NamedJsonSchema> | null {
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
  private getArrayItemsDescriptor(): NamedJsonSchema | null {
    if (!this.schema.items) {
      return null;
    }
    return new NamedJsonSchema(this.name, this.resolveReference(this.schema.items));
  }

  private getType(): DescriptorType | undefined {
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

  private getProperties(): { [propertyName: string]: JsonSchema } | null | undefined {
    if (this.schema.type !== 'object') {
      return null;
    }
    return this.resolveReference(this.schema).properties;
  }

  private resolveReference(schema: JsonSchema): JsonSchema {
    return schema.$ref ? this.schemaReferenceFactory.getReferencedSchema(schema) : schema;
  }

}
