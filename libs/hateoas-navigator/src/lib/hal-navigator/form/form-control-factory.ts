import {AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators} from '@angular/forms';
import {FormFieldType} from './form-field-type';
import {FormField} from './form-field';
import {ArrayField} from './array-field';
import {SubFormField} from './sub-form-field';
import {VersionedResourceObjectProperty} from '../hal-resource';

export class FormControlFactory {
  private static STANDARD_CONTROLS = [FormFieldType.TEXT, FormFieldType.DATE_PICKER, FormFieldType.BOOLEAN,
    FormFieldType.NUMBER, FormFieldType.INTEGER, FormFieldType.SELECT, FormFieldType.LINK];

  private static getValidatorFunctions(formField: FormField) {
    const validatorFunctions: Array<ValidatorFn> = [];
    if (formField.isRequired()) {
      validatorFunctions.push(Validators.required);
    }
    if (formField.getType() === FormFieldType.NUMBER) {
      validatorFunctions.push(Validators.pattern('^[0-9]+(.[0-9]*){0,1}$'));
    }
    if (formField.getType() === FormFieldType.INTEGER) {
      validatorFunctions.push(Validators.pattern('^[0-9]+$'));
    }
    return validatorFunctions;
  }

  constructor(private item?: VersionedResourceObjectProperty) {
  }

  getControls(fields: FormField[]): { [key: string]: AbstractControl } {
    const controls: { [key: string]: any } = {};
    fields.forEach(f => {
      controls[f.getName()!] = this.getControl(f);
    });
    return controls;
  }

  getControl(formField: FormField) {
    const property = this.item ? this.item.getChildProperty(formField.getName()!) : undefined;
    const value = property ? property.getFormValue() : undefined;
    return this.getControlWithValue(formField, value);
  }

  private getControlWithValue(formField: FormField, value: any) {
    if (formField.getType() === FormFieldType.ARRAY) {
      let array: AbstractControl[] = [];
      if (Array.isArray(value)) {
        array = value.map(item => this.getControlWithValue((formField as ArrayField).getArraySpec(), item));
      }
      return new UntypedFormArray(array);
    } else if (FormControlFactory.STANDARD_CONTROLS.some(type => type === formField.getType())) {
      return new UntypedFormControl({
          disabled: formField.isReadOnly(),
          value
        },
        FormControlFactory.getValidatorFunctions(formField));
    } else if (formField.getType() === FormFieldType.SUB_FORM) {
      return this.getFormGroup(formField as SubFormField, value);
    } else {
      throw new Error('Unknown form field type ' + formField.getType());
    }
  }

  private getFormGroup(parentFormField: SubFormField, obj: { [key: string]: any }): UntypedFormGroup {
    const formGroup: UntypedFormGroup = new UntypedFormGroup({});
    parentFormField.getSubFields().forEach(f => formGroup.addControl(f.getName()!, this.getControlWithValue(f,
      obj ? obj[f.getName()!] : undefined)));
    return formGroup;
  }
}
