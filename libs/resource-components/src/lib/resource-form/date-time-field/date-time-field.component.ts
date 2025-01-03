import {Component, Input, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {DatePickerField, DateTimeType} from 'hateoas-navigator';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {DateTimeFieldComponentInput} from './date-time-field-component-input';
import {CustomizableComponentType} from '../../customizable';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField} from '@angular/material/form-field';
import {NgIf} from '@angular/common';
import {MatInput} from '@angular/material/input';
import moment from 'moment';

@Component({
  templateUrl: './date-time-field.component.html',
  imports: [
    MatDatepickerToggle,
    MatFormField,
    MatDatepickerInput,
    ReactiveFormsModule,
    MatDatepicker,
    NgIf,
    MatInput
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
