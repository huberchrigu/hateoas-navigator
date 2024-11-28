import {Component, Input} from '@angular/core';
import {FormField} from 'hateoas-navigator';
import {ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {CustomizableComponentType} from '../../customizable';
import {InputFieldComponentInput, TypeType} from './input-field-component-input';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  templateUrl: './input-field.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput
  ],
  styleUrls: ['./input-field.component.sass', '../form-fields.sass']
})
export class InputFieldComponent implements InputFieldComponentInput {
  @Input()
  field!: FormField;

  @Input()
  control!: UntypedFormControl;

  @Input()
  type: TypeType = 'text';
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.INPUT_FIELD, InputFieldComponent);
