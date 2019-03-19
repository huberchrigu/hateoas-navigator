import {FormArray} from '@angular/forms';
import {VersionedResourceAdapter} from '../item/versioned-resource-adapter';
import {FormControlFactory} from './form-control-factory';
import {FormFieldType} from './form-field-type';
import {FormField} from './form-field';
import createSpyObj = jasmine.createSpyObj;
import SpyObjMethodNames = jasmine.SpyObjMethodNames;
import {ArrayField} from './array-field';
import {SubFormField} from './sub-form-field';
import {JsonArrayProperty} from '../../hal-navigator/json-property/json-property';
import {JsonValueType} from '../../hal-navigator/json-property/value-type/json-value-type';

describe('FormControlFactory', () => {
  it('should overtake values of an array of objects', () => {
    const fields: FormField[] = [
      createFieldMock<ArrayField>('array', FormFieldType.ARRAY, {
        getArraySpec: createFieldMock<SubFormField>('array', FormFieldType.SUB_FORM, {
          getSubFields: [createFieldMock<FormField>('value', FormFieldType.TEXT)]
        })
      })
    ];
    const resourceProperty = createSpyObj<JsonArrayProperty<JsonValueType>>('resourceProperty', ['getFormValue']);
    resourceProperty.getFormValue.and.returnValue([{'value': 1}, {'value': 2}]);
    const properties = {
      'array': resourceProperty
    };
    const item = {
      getChildProperty: (name) => properties[name]
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

function createFieldMock<T extends FormField>(name: string, type: FormFieldType, mockedMethods: { [NAME in keyof T]?: any } = null): FormField {
  const methodNames = {
    getName: name,
    getType: type,
    isReadOnly: false,
    isRequired: false
  } as SpyObjMethodNames<T>;
  if (mockedMethods) {
    Object.keys(mockedMethods).forEach(key => methodNames[key] = mockedMethods[key]);
  }
  return jasmine.createSpyObj<T>('formControlFactory', methodNames);
}
