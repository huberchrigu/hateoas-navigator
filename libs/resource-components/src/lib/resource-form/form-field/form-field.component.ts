import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {FormField, FormFieldType, SubFormField} from 'hateoas-navigator';
import {CustomizableComponentType} from '../../customizable';
import {InputFieldComponentInput} from '../input-field';
import {FormGroupComponentInput} from '../form-group';
import {FieldComponentInput} from '../field-component-input';
import {CheckboxFieldComponentInput} from '../checkbox-field';
import {DateTimeFieldComponentInput} from '../date-time-field';
import {SelectFieldComponentInput} from '../select-field';
import {AssociationFieldComponentInput} from '../association-field';
import {FormListComponentInput} from '../form-list';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {CustomizableComponent} from '../../customizable';
import {MatError} from '@angular/material/form-field';
import {NgIf} from '@angular/common';

@Component({
  templateUrl: './form-field.component.html',
  imports: [
    CustomizableComponent,
    MatError,
    NgIf
  ],
  encapsulation: ViewEncapsulation.None
})
export class FormFieldComponent implements OnInit, FormFieldComponentInput {
  @Input()
  field!: FormField;

  @Input()
  control!: AbstractControl;

  ngOnInit(): void {
    if (!this.field) {
      throw new Error(`The control ${JSON.stringify(this.control)} has no form field definition`);
    }
    if (!this.control) {
      throw new Error(`The form field ${JSON.stringify(this.field)} has no control object`);
    }
  }

  showRequiredError(): boolean {
    return this.showError('required');
  }

  showPatternError() {
    return this.showError('pattern');
  }

  isNumber(): boolean {
    return this.field.getType() === FormFieldType.NUMBER;
  }

  isInteger(): boolean {
    return this.field.getType() === FormFieldType.INTEGER;
  }

  getFormGroupComponentType(): FieldComponentType<FormGroupComponentInput> {
    return new FieldComponentType(CustomizableComponentType.FORM_GROUP, {
      formGroup: this.control,
      fields: (this.field as SubFormField).getSubFields()
    } as FormGroupComponentInput);
  }

  getFieldComponentType(): FieldComponentType<FieldComponentInput<FormField, AbstractControl>> {
    const input = {control: this.control, field: this.field} as FieldComponentInput<FormField, AbstractControl>;
    switch (this.field.getType()) {
      case FormFieldType.TEXT:
        return new FieldComponentType(CustomizableComponentType.INPUT_FIELD, input as InputFieldComponentInput);
      case FormFieldType.NUMBER:
      case FormFieldType.INTEGER:
        return new FieldComponentType(CustomizableComponentType.INPUT_FIELD, {...input, type: 'number'} as InputFieldComponentInput);
      case FormFieldType.BOOLEAN:
        return new FieldComponentType(CustomizableComponentType.CHECKBOX_FIELD, input as CheckboxFieldComponentInput);
      case FormFieldType.DATE_PICKER:
        return new FieldComponentType(CustomizableComponentType.DATE_TIME_FIELD, input as DateTimeFieldComponentInput);
      case FormFieldType.SELECT:
        return new FieldComponentType(CustomizableComponentType.SELECT_FIELD, input as SelectFieldComponentInput);
      case FormFieldType.LINK:
        return new FieldComponentType(CustomizableComponentType.ASSOCIATION_FIELD, input as AssociationFieldComponentInput);
      case FormFieldType.ARRAY:
        return new FieldComponentType(CustomizableComponentType.FORM_LIST, input as FormListComponentInput);
      case FormFieldType.SUB_FORM:
        throw Error('Invalid state');
      default:
        throw Error('Unknown type ' + this.field.getType() + ' of form field ' + this.field.getName());
    }
  }

  isSubForm() {
    return this.field.getType() === FormFieldType.SUB_FORM;
  }

  private showError(errorCode: string) {
    return this.control.touched && this.control.hasError(errorCode);
  }
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.FORM_FIELD, FormFieldComponent);

export interface FormFieldComponentInput extends FieldComponentInput<FormField, AbstractControl> {
}

class FieldComponentType<T> {
  constructor(public customizableType: CustomizableComponentType, public input: T) {
  }
}
