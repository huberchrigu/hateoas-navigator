import {FormControlFactory} from 'app/hal-navigator/form/form-control-factory';
import {VersionedResourceAdapter} from 'app/hal-navigator/item/versioned-resource-adapter';
import {FormField} from 'app/hal-navigator/form/form-field';
import {FormFieldType} from 'app/hal-navigator/form/form-field-type';
import {FormArray} from '@angular/forms';
import createSpyObj = jasmine.createSpyObj;
import {FormFieldOptions} from 'app/hal-navigator/form/form-field-options';

describe('FormControlFactory', () => {
  it('should overtake values of an array of objects', () => {
    const fields: FormField[] = [
      createFieldMock('array', FormFieldType.ARRAY, <FormFieldOptions> {
        getArraySpec: () => createFieldMock('array', FormFieldType.SUB_FORM, <FormFieldOptions> {
          getSubFields: () => [
            createFieldMock('value', FormFieldType.TEXT)
          ]
        })
      })
    ];
    const resourceProperty = createSpyObj('resourceProperty', ['getFormValue']);
    resourceProperty.getFormValue.and.returnValue([{'value': 1}, {'value': 2}]);
    const properties = {
      'array': resourceProperty
    };
    const item = {
      getData: (name, applyFunction) => applyFunction(properties[name])
    } as VersionedResourceAdapter;
    const testee = new FormControlFactory(item);
    const result = testee.getControls(fields);
    expect(Object.keys(result).length).toBe(1);
    const arrayControl = result['array'] as FormArray;
    expect(arrayControl).not.toBeNull();
    expect(arrayControl.controls.length).toBe(2);
    expect(arrayControl.controls[0].value).toEqual({'value': 1});
  });
});

function createFieldMock(name: string, type: FormFieldType, options?: FormFieldOptions): FormField {
  return {
    name: name,
    type: type,
    options: options
  } as FormField;
}
