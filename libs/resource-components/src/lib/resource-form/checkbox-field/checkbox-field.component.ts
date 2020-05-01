import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FormField} from 'hateoas-navigator';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {CheckboxFieldComponentInput} from './checkbox-field-component-input';
import {CustomizableComponentType} from '../../customizable/custom-component-configuration';

@Component({
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['../form-fields.sass', './checkbox-field.component.sass']
})
export class CheckboxFieldComponent implements CheckboxFieldComponentInput {
  @Input()
  field: FormField;

  @Input()
  control: FormControl;

}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.CHECKBOX_FIELD, CheckboxFieldComponent);
