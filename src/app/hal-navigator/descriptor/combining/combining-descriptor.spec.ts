import {CombiningDescriptor} from 'app/hal-navigator/descriptor/combining/combining-descriptor';
import {ResourceDescriptor} from 'app/hal-navigator/descriptor/resource-descriptor';
import {AlpsResourceDescriptor} from 'app/hal-navigator/descriptor/alps/alps-resource-descriptor';
import {JsonSchemaDescriptor} from 'app/hal-navigator/descriptor/json-schema/json-schema-descriptor';
import {FormField} from 'app/hal-navigator/schema/form/form-field';
import {FormFieldOptions} from 'app/hal-navigator/schema/form/form-field-options';
import {FormFieldType} from 'app/hal-navigator/schema/form/form-field-type';
import {DateTimeType} from 'app/hal-navigator/config/module-configuration';
import {SchemaReferenceFactory} from '@hal-navigator/schema/schema-reference-factory';
import {AlpsDocumentAdapter} from '@hal-navigator/alp-document/alps-document-adapter';
import {alps, jsonSchema} from '@hal-navigator/descriptor/combining/sample-input.spec';
import {ResourceDescriptorMockBuilder} from '@hal-navigator/descriptor/combining/resource-descriptor-mock-builder.spec';

describe('CombiningDescriptor', () => {
  it('should group all children by name', () => {
    const testee = new CombiningDescriptor([
      new ResourceDescriptorMockBuilder().withChildren([
        new ResourceDescriptorMockBuilder().withName('A').build(),
        new ResourceDescriptorMockBuilder().withName('B').build()
      ]).build(),
      new ResourceDescriptorMockBuilder().withChildren([
        new ResourceDescriptorMockBuilder().withName('B').build(),
        new ResourceDescriptorMockBuilder().withName('C').build()
      ]).build()
    ]);
    const result = testee.getChildren();
    expect(result.length).toBe(3);
    expectChild(result[0], 1, 'A');
    expectChild(result[1], 2, 'B');
    expectChild(result[2], 1, 'C');

    function expectChild(descriptor: ResourceDescriptor, expectedListLength: number, expectedName: string) {
      expect(descriptor['priorityList'].length).toBe(expectedListLength);
      expect(descriptor.getName()).toBe(expectedName);
    }
  });

  it('should resolve all associations', () => {
    const associatedResourceName = 'resource';
    const parentResourceName = 'parent';
    const childPropertyName = 'association';

    const alpsChild = prepareNotifiedMock<AlpsResourceDescriptor>(childPropertyName, [])
      .withResolveAssociatedResourceName(associatedResourceName).build();
    const alpsParent = prepareNotifiedMock<AlpsResourceDescriptor>(parentResourceName, [alpsChild])
      .withResolveAssociatedResourceName(null).build();

    const jsonSchemaChild = prepareNotifiedMock<JsonSchemaDescriptor>(childPropertyName, []).build();
    const jsonSchemaParent = prepareNotifiedMock<JsonSchemaDescriptor>(parentResourceName, [jsonSchemaChild]).build();

    const testee = new CombiningDescriptor([
      alpsParent, jsonSchemaParent
    ]);

    testee.resolveAssociations().subscribe(() => {
      expect(alpsParent.resolveAssociatedResourceName).toHaveBeenCalled();
      expect(alpsParent.getChildren).toHaveBeenCalled();
      expect(jsonSchemaParent.getChildren).toHaveBeenCalled();

      expect(alpsChild.resolveAssociatedResourceName).toHaveBeenCalled();
      expect(alpsChild.notifyAssociatedResource).toHaveBeenCalledWith(associatedResourceName);
      expect(alpsChild.resolveAssociation).toHaveBeenCalled();
      expect(jsonSchemaChild.notifyAssociatedResource).toHaveBeenCalledWith(associatedResourceName);
      expect(jsonSchemaChild.resolveAssociation).toHaveBeenCalled();
    });

    function prepareNotifiedMock<T extends ResourceDescriptor>(resourceName: string, children): ResourceDescriptorMockBuilder<T> {
      return new ResourceDescriptorMockBuilder<T>()
        .withName(resourceName)
        .withChildren(children)
        .withNotifyAssociatedResource()
        .withResolveAssociation();
    }
  });

  it('should provide form field specifications', () => {
    const staticDescriptor = mockStaticDescriptorWithTimeOptionChild();
    const jsonSchemaDescriptor = mockJsonSchemaDescriptorWithDatePickerChild();
    const alpsDescriptor = mockAlpsDescriptorWithoutChild();

    const testee = new CombiningDescriptor([staticDescriptor, jsonSchemaDescriptor, alpsDescriptor]);
    const result = testee.toFormField();

    expectField(result, 'object', 'Object', FormFieldType.SUB_FORM, true, false);
    expect(result.options.getSubFields().length).toBe(1);
    const timeField = result.options.getSubFields()[0];
    expectField(timeField, 'time', 'Time', FormFieldType.DATE_PICKER, false, false);
    expect(timeField.options.getDateTimeType()).toEqual(DateTimeType.TIME);

    function expectField(actualValue: FormField, name: string, title: string, type: FormFieldType, required: boolean, readOnly: boolean) {
      expect(actualValue.name).toEqual(name);
      expect(actualValue.title).toEqual(title);
      expect(actualValue.type).toEqual(type);
      expect(actualValue.required).toBe(required);
      expect(actualValue.readOnly).toBe(readOnly);
    }

    function mockJsonSchemaDescriptorWithDatePickerChild(): ResourceDescriptor {
      const jsonOptions = new FormFieldOptions();
      jsonOptions.setSubFields([new FormField('time', FormFieldType.DATE_PICKER, false,
        false, 'Time', new FormFieldOptions())]);
      return new ResourceDescriptorMockBuilder().withFormField(
        new FormField('object', FormFieldType.SUB_FORM, true, false, 'Object', jsonOptions)
      ).build();
    }

    function mockStaticDescriptorWithTimeOptionChild(): ResourceDescriptor {
      const timeOptions = new FormFieldOptions();
      timeOptions.setDateTimeType(DateTimeType.TIME);
      const staticOptions = new FormFieldOptions();
      staticOptions.setSubFields([new FormField('time', undefined,
        undefined, undefined, undefined, timeOptions)]);
      return new ResourceDescriptorMockBuilder().withFormField(new FormField('object', undefined,
        undefined, undefined, undefined, staticOptions)).build();
    }

    function mockAlpsDescriptorWithoutChild(): ResourceDescriptor {
      return new ResourceDescriptorMockBuilder().withFormField(
        new FormField('object', undefined, undefined, undefined, undefined, new FormFieldOptions()))
        .build();
    }
  });

  describe('After creating form fields from real input', () => {
    let fields: FormField[];

    beforeAll(() => {
      const testee = new CombiningDescriptor([
        new JsonSchemaDescriptor('meetingGroups', jsonSchema, null, new SchemaReferenceFactory(jsonSchema.definitions), undefined),
        new AlpsResourceDescriptor(new AlpsDocumentAdapter(alps).getRepresentationDescriptor().descriptor, undefined)
      ]);

      const meetingGroup = testee.toFormField();
      fields = meetingGroup.options.getSubFields();
    });

    it('should have five form elements of different types', () => {
      expect(fields.length).toBe(5);
      expect(fields[0].type).toEqual(FormFieldType.ARRAY);
      expect(fields[1].type).toEqual(FormFieldType.DATE_PICKER);
      expect(fields[2].type).toEqual(FormFieldType.ARRAY);
      expect(fields[3].type).toEqual(FormFieldType.TEXT);
      expect(fields[4].type).toEqual(FormFieldType.DATE_PICKER);
    });

    it('should have a "preferences" sub-field which allows an array and includes another "timeSpan" sub-field', () => {
      const preferences = fields[0].options.getArraySpec();
      expect(fields[0].name).toEqual('preferences');
      expect(preferences).toBeDefined();
      expect(preferences.options.getSubFields()).toBeDefined();

      const timeSpan = preferences.options.getSubFields()[0];
      expect(timeSpan.type).toEqual(FormFieldType.SUB_FORM);
      expect(timeSpan.options.getSubFields()).toBeDefined();
      expect(timeSpan.options.getSubFields().length).toBe(3);
    });

    it('should contain a link field that allows associations to "users" resources', () => {
      expect(fields[2].options.getArraySpec().type).toEqual(FormFieldType.LINK);
      expect(fields[2].options.getArraySpec().options.getLinkedResource()).toEqual('users');
    });
  });
});
