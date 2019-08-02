import {JsonSchema} from '../../schema/json-schema';
import {SchemaReferenceFactory} from '../../schema/schema-reference-factory';
import {JsonSchemaDescriptorMapper} from './json-schema-descriptor-mapper';
import {
  ArrayPropertyDescriptor,
  ObjectPropertyDescriptor,
  PropDescriptor
} from '../prop-descriptor';

describe('JsonSchemaDescriptorMapper', () => {
  it('should get referenced child', () => {
    const array = {
      type: 'array',
      items: {
        $ref: '#/definitions/obj'
      }
    } as JsonSchema;

    const referencedSchema: JsonSchema = {
      type: 'object',
      properties: {
        child: {
          title: 'Child'
        } as JsonSchema
      }
    } as JsonSchema;

    const referenceFactoryMock = jasmine.createSpyObj<SchemaReferenceFactory>('schemaReferenceFactory', ['getReferencedSchema']);
    referenceFactoryMock.getReferencedSchema.and.returnValue(referencedSchema);

    const testee = new JsonSchemaDescriptorMapper('testee', array, referenceFactoryMock)
      .toDescriptor() as ArrayPropertyDescriptor<PropDescriptor>;

    const objDescriptor = testee.getItemsDescriptor() as ObjectPropertyDescriptor;
    expect(objDescriptor.getChildDescriptor('child').getTitle()).toEqual('Child');
    expect(referenceFactoryMock.getReferencedSchema).toHaveBeenCalled();
  });

  it('should provide an array form field of uris', () => {
    const array: JsonSchema = {
      type: 'array',
      items: {
        type: 'string',
        format: 'uri'
      }
    };
    const testee = new JsonSchemaDescriptorMapper('testee', array, {} as SchemaReferenceFactory);
    const builder = testee.toBuilder();

    expect(builder.type).toEqual('array');
    expect(builder.arrayItems.schema.format).toEqual('uri');
  });
});
