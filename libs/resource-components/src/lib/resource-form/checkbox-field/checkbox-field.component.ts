import {Component, Input} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {FormField} from 'hateoas-navigator';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {CheckboxFieldComponentInput} from './checkbox-field-component-input';
import {CustomizableComponentType} from '../../customizable';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  templateUrl: './checkbox-field.component.html',
  imports: [
    MatCheckbox,
    ReactiveFormsModule
  ],
  styleUrls: ['../form-fields.sass', './checkbox-field.component.sass'],
  standalone: true
})
export class CheckboxFieldComponent implements CheckboxFieldComponentInput {
  @Input()
  field!: FormField;

  @Input()
  control!: UntypedFormControl;

}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.CHECKBOX_FIELD, CheckboxFieldComponent);
