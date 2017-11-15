import {FormControlFactory} from '@hal-navigator/schema/form/form-control-factory';
import {ItemAdapter} from '@hal-navigator/item/item-adapter';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {FormFieldType} from '@hal-navigator/schema/form/form-field-type';
import {ResourceProperty} from '@hal-navigator/resource-object/properties/resource-property';
import {FormArray, FormControl} from '@angular/forms';

describe('FormControlFactory', () => {
  it('should overtake values of an array of objects', () => {
    const fields: FormField[] = [
      {
        name: 'array',
        type: FormFieldType.ARRAY,
        options: {
          getSubFields: () => [
            {
              name: 'value',
              type: FormFieldType.TEXT
            } as FormField
          ]
        }
      } as FormField
    ];
    const properties = {
      'array': {
        getFormValue: () => [{'value': 1}, {'value': 2}]
      } as ResourceProperty
    };
    const item = {
      getProperty: (name) => properties[name]
    } as ItemAdapter;
    const testee = new FormControlFactory(item);
    const result = testee.getControls(fields);
    expect(Object.keys(result).length).toBe(1);
    const arrayControl = result['array'] as FormArray;
    expect(arrayControl).not.toBeNull();
    expect(arrayControl.controls.length).toBe(2);
    expect(arrayControl.controls[0].value).toEqual({'value': 1});
  });
});