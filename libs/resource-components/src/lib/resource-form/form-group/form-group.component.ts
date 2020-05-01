import {Component, Input, OnInit} from '@angular/core';
import {FormField} from 'hateoas-navigator';
import {FormGroup} from '@angular/forms';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {FormGroupComponentInput} from './form-group-component-input';
import {CustomizableComponentType} from '../../customizable/custom-component-configuration';
import {FormFieldComponentInput} from '../form-field/form-field.component';

@Component({
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.sass']
})
export class FormGroupComponent implements OnInit, FormGroupComponentInput {
  @Input()
  fields: FormField[];

  @Input()
  formGroup: FormGroup;

  ngOnInit(): void {
    if (!this.formGroup.controls) {
      throw new Error(`Erroneous type for sub-form: ${this.formGroup.constructor.name}`);
    }
  }

  getFormFieldType() {
    return CustomizableComponentType.FORM_FIELD;
  }

  getFormFieldInput(field: FormField): FormFieldComponentInput {
    const control = this.formGroup.get(field.getName());
    return {control, field};
  }
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.FORM_GROUP, FormGroupComponent);
