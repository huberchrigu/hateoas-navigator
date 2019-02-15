import {ActionType} from '../actions/action-type';
import {CombiningDescriptorMapper} from './combining-descriptor-mapper';
import {ResourceDescriptor} from 'hateoas-navigator/hal-navigator/descriptor/deprecated-resource-descriptor';
import {ArrayField, DatePickerField, DateTimeType, FormField, FormFieldBuilder, FormFieldType, LinkField, SubFormField} from 'hateoas-navigator';
import {JsonSchemaDescriptor} from 'hateoas-navigator/hal-navigator/descriptor/json-schema/json-schema-descriptor';
import {alps, jsonSchema} from 'hateoas-navigator/hal-navigator/descriptor/combining/sample-input.spec';
import {SchemaReferenceFactory} from 'hateoas-navigator/hal-navigator/schema/schema-reference-factory';
import {AlpsPropertyDescriptor} from 'hateoas-navigator/hal-navigator/descriptor/alps/alps-property-descriptor';
import {AlpsDocumentAdapter} from 'hateoas-navigator/hal-navigator/alps-document/alps-document-adapter';
import {ObjectPropertyDescriptor, PropDescriptor} from 'hateoas-navigator/hal-navigator/descriptor/deprecated-property-descriptor';
import {
  ObjectDescriptorMockBuilder,
  PropertyDescriptorMockBuilder
} from './property-descriptor-mock-builder.spec';
import {ResourceDescriptorMockBuilder} from 'hateoas-navigator/hal-navigator/descriptor/combining/resource-descriptor-mock-builder.spec';

describe('CombiningDescriptorMapper', () => {
  it('should not contain "update" action', () => {
    const property = new PropertyDescriptorMockBuilder().withName('property').build();
    const resourceWithCreateAndDelete = new ResourceDescriptorMockBuilder()
      .withEnabledActions(ActionType.CREATE_ITEM, ActionType.DELETE_ITEM).build();
    const resourceWithGets = new ResourceDescriptorMockBuilder()
      .withEnabledActions(ActionType.GET_COLLECTION, ActionType.GET_ITEM).build();
    const testee = new CombiningDescriptorMapper([property, resourceWithCreateAndDelete, resourceWithGets]).toDescriptor() as ResourceDescriptor;

    expect(testee.getActions().isUpdateEnabled()).toBeFalsy();
    expect(testee.getActions().isCreateEnabled()).toBeTruthy();
    expect(testee.getActions().isDeleteEnabled()).toBeTruthy();
    expect(testee.getActions().isGetCollectionEnabled()).toBeTruthy();
    expect(testee.getActions().isGetItemEnabled()).toBeTruthy();
  });

  it('should group all children by name', () => {
    const testee = new CombiningDescriptorMapper([
      new ObjectDescriptorMockBuilder().withChildrenDescriptors([
        new PropertyDescriptorMockBuilder().withName('A').build(),
        new PropertyDescriptorMockBuilder().withName('B').build()
      ]).build(),
      new ObjectDescriptorMockBuilder().withChildrenDescriptors([
        new PropertyDescriptorMockBuilder().withName('B').build(),
        new PropertyDescriptorMockBuilder().withName('C').build()
      ]).build()
    ]).toDescriptor() as ObjectPropertyDescriptor;
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

    const testee = new CombiningDescriptorMapper([staticDescriptor, jsonSchemaDescriptor, alpsDescriptor]).toDescriptor();
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

    function mockJsonSchemaDescriptorWithDatePickerChild(): PropDescriptor {
      const children = [new FormFieldBuilder('time').withRequired(false).withReadOnly(false)
        .withTitle('Time')];
      return new PropertyDescriptorMockBuilder().withFormFieldBuilder(
        new FormFieldBuilder('object').withRequired(true).withReadOnly(false).withTitle('Object')
          .withSubFields(children)
      ).build();
    }

    function mockStaticDescriptorWithTimeOptionChild(): PropDescriptor {
      const child = new FormFieldBuilder('time').withDateTimeType(DateTimeType.TIME);
      return new PropertyDescriptorMockBuilder().withFormFieldBuilder(new FormFieldBuilder('object').withSubFields([child]))
        .build();
    }

    function mockAlpsDescriptorWithoutChild(): PropDescriptor {
      return new PropertyDescriptorMockBuilder().withFormFieldBuilder(
        new FormFieldBuilder('object')).build();
    }
  });

  describe('After creating form fields from real input', () => {
    let fields: FormField[];

    beforeAll(() => {
      const testee = new CombiningDescriptorMapper([
        new JsonSchemaDescriptor('meetingGroups', jsonSchema, null, new SchemaReferenceFactory(jsonSchema.definitions)),
        new AlpsPropertyDescriptor(new AlpsDocumentAdapter(alps).getRepresentationDescriptor().descriptor, [])
      ]);

      const meetingGroup = testee.toFormFieldBuilder().build() as SubFormField;
      fields = meetingGroup.getSubFields();
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
