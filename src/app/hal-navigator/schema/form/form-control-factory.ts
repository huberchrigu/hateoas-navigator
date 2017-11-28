import {FormField} from '@hal-navigator/schema/form/form-field';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {VersionedResourceObject} from '@hal-navigator/item/versioned-resource-object';
import {FormFieldType} from '@hal-navigator/schema/form/form-field-type';

export class FormControlFactory {
  private static STANDARD_CONTROLS = [FormFieldType.TEXT, FormFieldType.DATE_PICKER,
    FormFieldType.NUMBER, FormFieldType.INTEGER, FormFieldType.SELECT, FormFieldType.LINK];

  constructor(private item?: VersionedResourceObject) {
  }

  getControls(fields: FormField[]): { [key: string]: AbstractControl } {
    const controls = {};
    fields.forEach(f => {
      controls[f.name] = this.getControl(f);
    });
    return controls;
  }

  getControl(formField: FormField) {
    const value = this.item ? this.item.getData(formField.name, d => d.getFormValue()) : undefined;
    return this.getControlWithValue(formField, value);
  }

  private getControlWithValue(formField: FormField, value: any) {
    if (formField.type === FormFieldType.ARRAY) {
      let array: AbstractControl[] = [];
      if (Array.isArray(value)) {
        array = value.map(item => this.getControlWithValue(formField.options.getArraySpec(), item));
      }
      return new FormArray(array);
    } else if (FormControlFactory.STANDARD_CONTROLS.includes(formField.type)) {
      return new FormControl({
          disabled: formField.readOnly,
          value: value
        },
        this.getValidatorFunctions(formField));
    } else if (formField.type === FormFieldType.SUB_FORM) {
      return this.getFormGroup(formField, value);
    } else {
      throw new Error('Unknown form field type ' + formField.type);
    }
  }

  private getFormGroup(parentFormField: FormField, obj: Object): FormGroup {
    const formGroup: FormGroup = new FormGroup({});
    parentFormField.options.getSubFields().forEach(f => formGroup.addControl(f.name, this.getControlWithValue(f,
      obj ? obj[f.name] : undefined)));
    return formGroup;
  }

  private getValidatorFunctions(formField: FormField) {
    const validatorFunctions: Array<ValidatorFn> = [];
    if (formField.required) {
      validatorFunctions.push(Validators.required);
    }
    if (formField.type === FormFieldType.NUMBER) {
      validatorFunctions.push(Validators.pattern('^[0-9]+(.[0-9]*){0,1}$'));
    }
    if (formField.type === FormFieldType.INTEGER) {
      validatorFunctions.push(Validators.pattern('^[0-9]+$'));
    }
    return validatorFunctions;
  }
}
