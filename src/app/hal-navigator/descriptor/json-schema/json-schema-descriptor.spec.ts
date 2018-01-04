import {JsonSchemaDescriptor} from '@hal-navigator/descriptor/json-schema/json-schema-descriptor';
import {JsonSchema} from 'app/hal-navigator/schema/json-schema';
import {SchemaReferenceFactory} from 'app/hal-navigator/schema/schema-reference-factory';

describe('JsonSchemaDescriptor', () => {
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

    const testee = new JsonSchemaDescriptor('testee', array, null, referenceFactoryMock);

    expect(testee.getChild('child').getTitle()).toEqual('Child');
    expect(referenceFactoryMock.getReferencedSchema).toHaveBeenCalled();
  });
});
