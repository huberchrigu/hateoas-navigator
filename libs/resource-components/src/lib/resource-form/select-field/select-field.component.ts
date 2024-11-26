import {Component, Input} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {SelectField} from 'hateoas-navigator';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {SelectFieldComponentInput} from './select-field-component-input';
import {CustomizableComponentType} from '../../customizable';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatFormField} from '@angular/material/form-field';
import {NgForOf} from '@angular/common';

@Component({
  templateUrl: './select-field.component.html',
  imports: [
    MatSelect,
    MatFormField,
    ReactiveFormsModule,
    MatOption,
    NgForOf
  ],
  styleUrls: ['../form-fields.sass']
})
export class SelectFieldComponent implements SelectFieldComponentInput {
  @Input()
  field: SelectField;

  @Input()
  control: UntypedFormControl;
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.SELECT_FIELD, SelectFieldComponent);
