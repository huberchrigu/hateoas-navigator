import {JsonSchema} from './json-schema';

export class SchemaReferenceFactory {
  private static readonly REFERENCE_PREFIX = '#/definitions/';

  constructor(private definitions: { [schema: string]: JsonSchema } | undefined) {
  }


  getReferencedSchema(reference: JsonSchema): JsonSchema {
    if (!reference.$ref) {
      throw new Error(`${JSON.stringify(reference)} is not a valid reference`);
    }
    if (reference.$ref.startsWith(SchemaReferenceFactory.REFERENCE_PREFIX)) {
      return this.definitions![reference.$ref.substring(SchemaReferenceFactory.REFERENCE_PREFIX.length)];
    }
    throw new Error(reference.$ref + ' is not a valid definition');
  }
}
