import {Component, Input, OnInit} from '@angular/core';
import {FormField} from 'hateoas-navigator';
import {ReactiveFormsModule, UntypedFormGroup} from '@angular/forms';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {FormGroupComponentInput} from './form-group-component-input';
import {CustomizableComponentType} from '../../customizable';
import {FormFieldComponentInput} from '../form-field';
import {CustomizableComponent} from '../../customizable';
import {NgForOf} from '@angular/common';

@Component({
  templateUrl: './form-group.component.html',
  imports: [
    ReactiveFormsModule,
    CustomizableComponent,
    NgForOf
  ],
  styleUrls: ['./form-group.component.sass'],
  standalone: true
})
export class FormGroupComponent implements OnInit, FormGroupComponentInput {
  @Input()
  fields!: FormField[];

  @Input()
  formGroup!: UntypedFormGroup;

  ngOnInit(): void {
    if (!this.formGroup.controls) {
      throw new Error(`Erroneous type for sub-form: ${this.formGroup.constructor.name}`);
    }
  }

  getFormFieldType() {
    return CustomizableComponentType.FORM_FIELD;
  }

  getFormFieldInput(field: FormField): FormFieldComponentInput {
    const control = this.formGroup.get(field.getName()!)!;
    return {control, field};
  }
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.FORM_GROUP, FormGroupComponent);
