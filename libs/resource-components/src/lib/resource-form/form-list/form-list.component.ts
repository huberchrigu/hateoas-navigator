import {Component, Input} from '@angular/core';
import {AbstractControl, FormArray} from '@angular/forms';
import {ArrayField, FormControlFactory, FormField} from 'hateoas-navigator';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {FormListComponentInput} from './form-list-component-input';
import {CustomizableComponentType} from '../../customizable/custom-component-configuration';
import {FormFieldComponentInput} from '../form-field/form-field.component';

@Component({
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.sass']
})
export class FormListComponent implements FormListComponentInput {

  private formControlFactory = new FormControlFactory();

  @Input()
  control: FormArray;

  @Input()
  field: ArrayField;

  onRemove(control: AbstractControl) {
    const index = this.control.controls.indexOf(control);
    this.control.removeAt(index);
  }

  onAdd() {
    const item: FormField = this.field.getArraySpec();
    this.control.push(this.formControlFactory.getControl(item));
  }

  getFormFieldType() {
    return CustomizableComponentType.FORM_FIELD;
  }

  getFormFieldInput(formControl: AbstractControl): FormFieldComponentInput {
    return {control: formControl, field: this.field.getArraySpec()};
  }
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.FORM_LIST, FormListComponent);
