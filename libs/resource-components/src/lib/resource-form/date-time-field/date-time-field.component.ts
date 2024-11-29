import {Component, Input} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {DatePickerField, DateTimeType} from 'hateoas-navigator';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {DateTimeFieldComponentInput} from './date-time-field-component-input';
import {CustomizableComponentType} from '../../customizable';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField} from '@angular/material/form-field';
import {NgIf} from '@angular/common';
import {MatInput} from '@angular/material/input';
import {MatTimepicker, MatTimepickerInput} from '@angular/material/timepicker';

@Component({
  templateUrl: './date-time-field.component.html',
  imports: [
    MatDatepickerToggle,
    MatFormField,
    MatDatepickerInput,
    ReactiveFormsModule,
    MatDatepicker,
    NgIf,
    MatInput,
    MatTimepicker,
    MatTimepickerInput
  ],
  styleUrls: ['./date-time-field.component.sass', '../form-fields.sass'],
  standalone: true
})
export class DateTimeFieldComponent implements DateTimeFieldComponentInput {
  @Input()
  field!: DatePickerField;

  @Input()
  control!: UntypedFormControl;

  getType(): string {
    switch (this.field.getDateTimeType()) {
      case DateTimeType.DATE:
        return 'date';
      case DateTimeType.TIME:
        return 'time';
      case DateTimeType.DATE_TIME:
        return 'datetime';
      default:
        throw new Error('Missing date/time type for ' + this.field.getName());
    }
  }
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.DATE_TIME_FIELD, DateTimeFieldComponent);
