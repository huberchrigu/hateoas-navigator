import {FormArray} from '@angular/forms';
import createSpyObj = jasmine.createSpyObj;
import {VersionedResourceAdapter} from '../item/versioned-resource-adapter';
import {FormControlFactory} from './form-control-factory';
import {FormFieldType} from './form-field-type';
import {FormField} from './form-field';

describe('FormControlFactory', () => {
  it('should overtake values of an array of objects', () => {
    const fields: FormField[] = [
      createFieldMock('array', FormFieldType.ARRAY, {
        getArraySpec: createFieldMock('array', FormFieldType.SUB_FORM, {
          getSubFields: [createFieldMock('value', FormFieldType.TEXT)]
        })
      })
    ];
    const resourceProperty = createSpyObj('resourceProperty', ['getFormValue']);
    resourceProperty.getFormValue.and.returnValue([{'value': 1}, {'value': 2}]);
    const properties = {
      'array': resourceProperty
    };
    const item = {
      getPropertyAs: (name, applyFunction) => applyFunction(properties[name])
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

function createFieldMock(name: string, type: FormFieldType, mockedMethods: { [name: string]: any } = {}): FormField {
  const methodNames = Object.keys(mockedMethods);
  const mock = jasmine.createSpyObj<FormField>('formControlFactory',
    ['getName', 'getType', 'isReadOnly', 'isRequired', ...methodNames]);
  mock.getName.and.returnValue(name);
  mock.getType.and.returnValue(type);
  methodNames.forEach(method => mock[method].and.returnValue(mockedMethods[method]));
  return mock;
}
