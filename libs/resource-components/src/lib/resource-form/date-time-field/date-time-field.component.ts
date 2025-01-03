import {Component, Input, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {DatePickerField, DateTimeType} from 'hateoas-navigator';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {DateTimeFieldComponentInput} from './date-time-field-component-input';
import {CustomizableComponentType} from '../../customizable';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {NgIf} from '@angular/common';
import {MatInput} from '@angular/material/input';
import moment from 'moment';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';

/**
 * Important: The Angular Material timepicker saves the value as Date, which can cause issues if the backend ignores the date part.
 * Example: "12:00 AM" for +01:00 results in yesterday's date with time 23:00 and timezone Z.
 */
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
    MatTimepickerInput,
    MatTimepickerToggle,
    MatTimepicker,
    MatLabel
  ],
  styleUrls: ['./date-time-field.component.sass', '../form-fields.sass'],
  standalone: true
})
export class DateTimeFieldComponent implements DateTimeFieldComponentInput, OnInit {
  @Input()
  field!: DatePickerField;

  @Input()
  control!: UntypedFormControl;

  dateTimeControl!: FormControl<string | null>;

  ngOnInit() {
    if (this.field.getDateTimeType() === DateTimeType.DATE_TIME) {
      this.dateTimeControl = new FormControl(this.withoutTimeZone(this.control.value));
    }
  }

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

  updateDateTime(_event: Event) {
    this.control.setValue(this.withTimeZone(this.dateTimeControl.value));
  }

  private withTimeZone(time: string | null) {
    return time ? moment(time).format() : time;
  }

  private withoutTimeZone(time: string) {
    return time ? moment(time).local().format('YYYY-MM-DDTHH:mm') : time;
  }
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.DATE_TIME_FIELD, DateTimeFieldComponent);
