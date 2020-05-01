import {Component, Input} from '@angular/core';
import {FormField} from 'hateoas-navigator';
import {FormControl} from '@angular/forms';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {CustomizableComponentType} from '../../customizable/custom-component-configuration';
import {InputFieldComponentInput, TypeType} from './input-field-component-input';

@Component({
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.sass', '../form-fields.sass']
})
export class InputFieldComponent implements InputFieldComponentInput {
  @Input()
  field: FormField;

  @Input()
  control: FormControl;

  @Input()
  type: TypeType = 'text';
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.INPUT_FIELD, InputFieldComponent);
