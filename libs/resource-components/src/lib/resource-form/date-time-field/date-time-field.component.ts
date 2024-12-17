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

  private timezoneSuffix = ':00Z';

  ngOnInit() {
    if (this.field.getDateTimeType() === DateTimeType.DATE_TIME) {
      this.dateTimeControl = new FormControl(this.withoutTimeZone(this.control.value));
    }
  }

  private withoutTimeZone(time: string) {
    return time && time.length + this.timezoneSuffix.length ? time.substring(0, time.length - this.timezoneSuffix.length) : time; // TODO: This is just a simplification
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

  updateDateTime(event: Event) {
    this.control.setValue(this.dateTimeControl.value + this.timezoneSuffix); // TODO: This is just a simplification
  }
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.DATE_TIME_FIELD, DateTimeFieldComponent);
