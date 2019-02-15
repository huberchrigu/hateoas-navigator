import {JsonSchema} from '../../schema/json-schema';
import {SchemaReferenceFactory} from '../../schema/schema-reference-factory';
import {JsonSchemaDescriptor} from './json-schema-descriptor';
import {FormFieldBuilder} from '../../form/form-field-builder';
import {FormFieldType} from '../../form/form-field-type';
import {JsonSchemaDescriptorMapper} from 'hateoas-navigator/hal-navigator/descriptor/json-schema/json-schema-descriptor-mapper';
import {ArrayPropertyDescriptor, ObjectPropertyDescriptor, PropDescriptor} from 'hateoas-navigator/hal-navigator/descriptor/deprecated-property-descriptor';

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

    const testee = new JsonSchemaDescriptorMapper('testee', array, referenceFactoryMock).toDescriptor() as ArrayPropertyDescriptor<PropDescriptor>;

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
    const testee = new JsonSchemaDescriptor('testee', array, null, {} as SchemaReferenceFactory);
    const builder: FormFieldBuilder = testee.toFormFieldBuilder();

    expect(builder['type']).toEqual(FormFieldType.ARRAY);
    expect(builder['arraySpecProviders'][0]()['type']).toEqual(FormFieldType.LINK);
  });
});
