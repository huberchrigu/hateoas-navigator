import {ActionType} from '../actions/action-type';
import {CombiningDescriptorMapper} from './combining-descriptor-mapper';
import {ResourceDescriptor} from 'hateoas-navigator/hal-navigator/descriptor/resource-descriptor';
import {
  ArrayField,
  DatePickerField,
  DateTimeType,
  FormField,
  FormFieldBuilder,
  FormFieldType,
  LinkField,
  ResourceActions,
  SubFormField
} from 'hateoas-navigator';
import {alps, jsonSchema} from 'hateoas-navigator/hal-navigator/descriptor/combining/sample-input.spec';
import {SchemaReferenceFactory} from 'hateoas-navigator/hal-navigator/schema/schema-reference-factory';
import {AlpsDocumentAdapter} from 'hateoas-navigator/hal-navigator/alps-document/alps-document-adapter';
import {ObjectPropertyDescriptor, PropDescriptor} from 'hateoas-navigator/hal-navigator/descriptor/prop-descriptor';
import {JsonSchemaDescriptorMapper} from 'hateoas-navigator/hal-navigator/descriptor/json-schema/json-schema-descriptor-mapper';
import {AlpsDescriptorMapper} from 'hateoas-navigator/hal-navigator/descriptor/alps/alps-descriptor-mapper';
import {DescriptorMapper} from 'hateoas-navigator/hal-navigator/descriptor/mapper/descriptor-mapper';
import {DescriptorBuilder, FieldProcessor} from 'hateoas-navigator/hal-navigator/descriptor/mapper/descriptor-builder';
import {DefaultMapperConfigs} from 'hateoas-navigator/hal-navigator/descriptor/combining/mapper-config';

describe('CombiningDescriptorMapper', () => {
  it('should not contain "update" action', () => {
    const property = descriptorMapper({name: 'property'} as DescriptorBuilder<any>);
    const resourceWithCreateAndDelete = descriptorMapper({
      actions: toActions(ActionType.CREATE_ITEM, ActionType.DELETE_ITEM),
      children: [descriptorMapper({name: 'child'} as DescriptorBuilder<DescriptorMapper<any>>)]
    } as DescriptorBuilder<any>);
    const resourceWithGets = descriptorMapper({
      actions: toActions(ActionType.GET_COLLECTION, ActionType.GET_ITEM)
    } as DescriptorBuilder<any>);
    let testee;
    try {
      testee = new CombiningDescriptorMapper([property, resourceWithCreateAndDelete, resourceWithGets], {})
        .toDescriptor() as ResourceDescriptor;
    } catch (e) {
      console.error(e);
    }
    expect(testee.getActions().isUpdateEnabled()).toBeFalsy();
    expect(testee.getActions().isCreateEnabled()).toBeTruthy();
    expect(testee.getActions().isDeleteEnabled()).toBeTruthy();
    expect(testee.getActions().isGetCollectionEnabled()).toBeTruthy();
    expect(testee.getActions().isGetItemEnabled()).toBeTruthy();
  });

  it('should group all children by name', () => {
    const testee = new CombiningDescriptorMapper([
      descriptorMapper({
        children: [
          descriptorMapper({name: 'A'} as DescriptorBuilder<any>),
          descriptorMapper({name: 'B'} as DescriptorBuilder<any>)
        ]
      } as DescriptorBuilder<any>),
      descriptorMapper({
        children: [
          descriptorMapper({name: 'B'} as DescriptorBuilder<any>),
          descriptorMapper({name: 'C'} as DescriptorBuilder<any>)
        ]
      } as DescriptorBuilder<any>)
    ], {}).toDescriptor() as ObjectPropertyDescriptor;
    const result = testee.getChildDescriptors();
    expect(result.length).toBe(3);
    expectChild(result[0], 'A');
    expectChild(result[1], 'B');
    expectChild(result[2], 'C');

    function expectChild(descriptor: PropDescriptor, expectedName: string) {
      expect(descriptor.getName()).toBe(expectedName);
    }
  });

  it('should provide form field specifications', () => {
    const staticDescriptor = mockStaticDescriptorWithTimeOptionChild();
    const jsonSchemaDescriptor = mockJsonSchemaDescriptorWithDatePickerChild();
    const alpsDescriptor = mockAlpsDescriptorWithoutChild();

    const testee = new CombiningDescriptorMapper([staticDescriptor, jsonSchemaDescriptor, alpsDescriptor], {}).toDescriptor();
    const result = testee.toFormFieldBuilder().build() as SubFormField;

    expectField(result, 'object', 'Object', FormFieldType.SUB_FORM, true, false);
    expect(result.getSubFields().length).toBe(1);
    const timeField = result.getSubFields()[0] as DatePickerField;
    expectField(timeField, 'time', 'Time', FormFieldType.DATE_PICKER, false, false);
    expect(timeField.getDateTimeType()).toEqual(DateTimeType.TIME);

    function expectField(actualValue: FormField, name: string, title: string, type: FormFieldType, required: boolean, readOnly: boolean) {
      expect(actualValue.getName()).toEqual(name);
      expect(actualValue.getTitle()).toEqual(title);
      expect(actualValue.getType()).toEqual(type);
      expect(actualValue.isRequired()).toBe(required);
      expect(actualValue.isReadOnly()).toBe(readOnly);
    }

    function mockStaticDescriptorWithTimeOptionChild(): DescriptorMapper<any> {
      return descriptorMapper({
        name: 'object',
        children: [descriptorMapper({
          name: 'time',
          fieldProcessor: builder => builder.withDateTimeType(DateTimeType.TIME)
        } as DescriptorBuilder<any>)]
      } as DescriptorBuilder<any>);
    }

    function mockJsonSchemaDescriptorWithDatePickerChild(): DescriptorMapper<any> {
      const children = [descriptorMapper({
        name: 'time',
        fieldProcessor: builder => builder.withRequired(false).withReadOnly(false)
          .withTitle('Time')
      } as DescriptorBuilder<any>)];
      const fieldProcessor: FieldProcessor = (fieldBuilder: FormFieldBuilder) => fieldBuilder.withRequired(true)
        .withReadOnly(false)
        .withTitle('Object');
      return descriptorMapper({
        name: 'object',
        fieldProcessor: fieldProcessor,
        children: children
      } as DescriptorBuilder<any>);
    }

    function mockAlpsDescriptorWithoutChild(): DescriptorMapper<any> {
      return descriptorMapper({name: 'object'} as DescriptorBuilder<any>);
    }
  });

  describe('After creating form fields from real input', () => {
    let fields: FormField[];

    beforeAll(() => {
      try {
        const testee = new CombiningDescriptorMapper([
          new JsonSchemaDescriptorMapper('meetingGroups', jsonSchema, new SchemaReferenceFactory(jsonSchema.definitions)),
          new AlpsDescriptorMapper(new AlpsDocumentAdapter(alps).getRepresentationDescriptor().descriptor, [])
        ], DefaultMapperConfigs.ignoreChildrenFromAlps()).toDescriptor();
        const meetingGroup = testee.toFormFieldBuilder().build() as SubFormField;
        fields = meetingGroup.getSubFields();
      } catch (e) {
        console.error(e);
      }
    });

    it('should have five form elements of different types', () => {
      expect(fields.length).toBe(5);
      expect(fields[0].getType()).toEqual(FormFieldType.ARRAY);
      expect(fields[1].getType()).toEqual(FormFieldType.DATE_PICKER);
      expect(fields[2].getType()).toEqual(FormFieldType.ARRAY);
      expect(fields[3].getType()).toEqual(FormFieldType.TEXT);
      expect(fields[4].getType()).toEqual(FormFieldType.DATE_PICKER);
    });

    it('should have a "preferences" sub-field which allows an array and includes another "timeSpan" sub-field', () => {
      const preferences = (fields[0] as ArrayField).getArraySpec() as SubFormField;
      expect(fields[0].getName()).toEqual('preferences');
      expect(preferences).toBeDefined();
      expect(preferences.getSubFields()).toBeDefined();

      const timeSpan = preferences.getSubFields()[0] as SubFormField;
      expect(timeSpan.getType()).toEqual(FormFieldType.SUB_FORM);
      expect(timeSpan.getSubFields()).toBeDefined();
      expect(timeSpan.getSubFields().length).toBe(3);
    });

    it('should contain a link field that allows associations to "users" resources', () => {
      const array = fields[2] as ArrayField;
      expect(array.getArraySpec().getType()).toEqual(FormFieldType.LINK);
      expect((array.getArraySpec() as LinkField).getLinkedResource()).toEqual('users');
    });
  });
});

/**
 * Adds the default fieldProcessor property and creates a mock.
 */
function descriptorMapper(builderProperties: DescriptorBuilder<DescriptorMapper<any>>): DescriptorMapper<any> {
  if (!builderProperties.fieldProcessor) {
    builderProperties.fieldProcessor = builder => builder;
  }
  if (!builderProperties.builderFunction) {
    builderProperties.builderFunction = obj => obj;
  }
  return jasmine.createSpyObj('mapper with builder: ' + JSON.stringify(builderProperties), {
    toBuilder: builderProperties,
    getMapperName: 'mapper mock'
  });
}

function toActions(...types: ActionType[]): ResourceActions {
  return new ResourceActions(types.map(type => jasmine.createSpyObj('ResourceAction', {
    getType: type
  })));
}
