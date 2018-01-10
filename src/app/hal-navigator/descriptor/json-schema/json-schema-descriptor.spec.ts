import {JsonSchemaDescriptor} from '@hal-navigator/descriptor/json-schema/json-schema-descriptor';
import {JsonSchema} from 'app/hal-navigator/schema/json-schema';
import {SchemaReferenceFactory} from 'app/hal-navigator/schema/schema-reference-factory';
import {FormFieldType} from '@hal-navigator/form/form-field-type';
import {FormFieldBuilder} from '@hal-navigator/form/form-field-builder';

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

    expect(testee.getArrayItemsDescriptor().getChildDescriptor('child').getTitle()).toEqual('Child');
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
    const testee = new JsonSchemaDescriptor('testee', array, null, {} as SchemaReferenceFactory);
    const builder: FormFieldBuilder = testee.toFormFieldBuilder();

    expect(builder['type']).toEqual(FormFieldType.ARRAY);
    expect(builder['arraySpecProviders'][0]()['type']).toEqual(FormFieldType.LINK);
  });
});
