import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SelectField} from 'hateoas-navigator';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {SelectFieldComponentInput} from './select-field-component-input';
import {CustomizableComponentType} from '../../customizable/custom-component-configuration';

@Component({
  templateUrl: './select-field.component.html',
  styleUrls: ['../form-fields.sass']
})
export class SelectFieldComponent implements SelectFieldComponentInput {
  @Input()
  field: SelectField;

  @Input()
  control: FormControl;
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.SELECT_FIELD, SelectFieldComponent);
