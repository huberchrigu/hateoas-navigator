import {FormFieldFactory} from '@hal-navigator/schema/form/form-field-factory';
import {JsonSchema} from '@hal-navigator/schema/json-schema';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {FormFieldType} from '@hal-navigator/schema/form/form-field-type';

describe('FormFieldFactory', () => {
  it('should create form fields', () => {
    const testee = new FormFieldFactory([], {});

    const result = testee.createFormFields({
      textField: {
        type: 'string'
      } as JsonSchema
    });

    expect(result.length).toBe(1);
    expect(result[0].type).toEqual(FormFieldType.TEXT);
    expect(result[0].name).toEqual('textField');
  });
});
