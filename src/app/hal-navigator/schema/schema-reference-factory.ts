import {JsonSchema, Reference} from '@hal-navigator/schema/json-schema';

export class SchemaReferenceFactory {
  private static readonly REFERENCE_PREFIX = '#/definitions/';

  constructor(private definitions: { [schema: string]: JsonSchema }) {
  }


  getReferencedSchema(reference: Reference): JsonSchema {
    if (reference.$ref.startsWith(SchemaReferenceFactory.REFERENCE_PREFIX)) {
      return this.definitions[reference.$ref.substring(SchemaReferenceFactory.REFERENCE_PREFIX.length)];
    }
    throw new Error(reference.$ref + ' is not a valid definition');
  }
}
