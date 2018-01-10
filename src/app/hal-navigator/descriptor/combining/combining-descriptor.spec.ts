import {CombiningDescriptor} from 'app/hal-navigator/descriptor/combining/combining-descriptor';
import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {AlpsPropertyDescriptor} from 'app/hal-navigator/descriptor/alps/alps-property-descriptor';
import {JsonSchemaDescriptor} from 'app/hal-navigator/descriptor/json-schema/json-schema-descriptor';
import {FormField} from 'app/hal-navigator/form/form-field';
import {FormFieldType} from 'app/hal-navigator/form/form-field-type';
import {DateTimeType} from 'app/hal-navigator/config/module-configuration';
import {SchemaReferenceFactory} from '@hal-navigator/schema/schema-reference-factory';
import {AlpsDocumentAdapter} from '@hal-navigator/alps-document/alps-document-adapter';
import {alps, jsonSchema} from '@hal-navigator/descriptor/combining/sample-input.spec';
import {PropertyDescriptorMockBuilder} from '@hal-navigator/descriptor/combining/property-descriptor-mock-builder.spec';
import {DatePickerField} from '@hal-navigator/form/date-picker-field';
import {SubFormField} from '@hal-navigator/form/sub-form-field';
import {ArrayField} from '@hal-navigator/form/array-field';
import {LinkField} from '@hal-navigator/form/link-field';
import {FormFieldBuilder} from '@hal-navigator/form/form-field-builder';

describe('CombiningDescriptor', () => {
  it('should group all children by name', () => {
    const testee = new CombiningDescriptor([
      new PropertyDescriptorMockBuilder().withChildrenDescriptors([
        new PropertyDescriptorMockBuilder().withName('A').build(),
        new PropertyDescriptorMockBuilder().withName('B').build()
      ]).build(),
      new PropertyDescriptorMockBuilder().withChildrenDescriptors([
        new PropertyDescriptorMockBuilder().withName('B').build(),
        new PropertyDescriptorMockBuilder().withName('C').build()
      ]).build()
    ]);
    const result = testee.getChildrenDescriptors();
    expect(result.length).toBe(3);
    expectChild(result[0], 1, 'A');
    expectChild(result[1], 2, 'B');
    expectChild(result[2], 1, 'C');

    function expectChild(descriptor: PropertyDescriptor, expectedListLength: number, expectedName: string) {
      expect(descriptor['priorityList'].length).toBe(expectedListLength);
      expect(descriptor.getName()).toBe(expectedName);
    }
  });

  it('should provide form field specifications', () => {
    const staticDescriptor = mockStaticDescriptorWithTimeOptionChild();
    const jsonSchemaDescriptor = mockJsonSchemaDescriptorWithDatePickerChild();
    const alpsDescriptor = mockAlpsDescriptorWithoutChild();

    const testee = new CombiningDescriptor([staticDescriptor, jsonSchemaDescriptor, alpsDescriptor]);
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

    function mockJsonSchemaDescriptorWithDatePickerChild(): PropertyDescriptor {
      const children = [new FormFieldBuilder('time').withRequired(false).withReadOnly(false)
        .withTitle('Time')];
      return new PropertyDescriptorMockBuilder().withFormFieldBuilder(
        new FormFieldBuilder('object').withRequired(true).withReadOnly(false).withTitle('Object')
          .withSubFields(children)
      ).build();
    }

    function mockStaticDescriptorWithTimeOptionChild(): PropertyDescriptor {
      const child = new FormFieldBuilder('time').withDateTimeType(DateTimeType.TIME);
      return new PropertyDescriptorMockBuilder().withFormFieldBuilder(new FormFieldBuilder('object').withSubFields([child]))
        .build();
    }

    function mockAlpsDescriptorWithoutChild(): PropertyDescriptor {
      return new PropertyDescriptorMockBuilder().withFormFieldBuilder(
        new FormFieldBuilder('object')).build();
    }
  });

  describe('After creating form fields from real input', () => {
    let fields: FormField[];

    beforeAll(() => {
      const testee = new CombiningDescriptor([
        new JsonSchemaDescriptor('meetingGroups', jsonSchema, null, new SchemaReferenceFactory(jsonSchema.definitions)),
        new AlpsPropertyDescriptor(new AlpsDocumentAdapter(alps).getRepresentationDescriptor().descriptor)
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
