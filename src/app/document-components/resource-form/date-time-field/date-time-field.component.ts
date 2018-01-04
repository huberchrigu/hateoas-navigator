import {Component, Input} from '@angular/core';
import {FormField} from '@hal-navigator/form/form-field';
import {AbstractControl} from '@angular/forms';
import {DateTimeType} from '@hal-navigator/config/module-configuration';

@Component({
  selector: 'app-date-time-field',
  templateUrl: './date-time-field.component.html',
  styleUrls: ['./date-time-field.component.sass', '../form-fields.sass']
})
export class DateTimeFieldComponent {
  @Input()
  field: FormField;

  @Input()
  control: AbstractControl;

  getType(): string {
    switch (this.field.options.getDateTimeType()) {
      case DateTimeType.DATE:
        return 'date';
      case DateTimeType.TIME:
        return 'time';
      case DateTimeType.DATE_TIME:
        return 'datetime';
      default:
        throw new Error('Missing date/time type for ' + this.field.name);
    }
  }
}
