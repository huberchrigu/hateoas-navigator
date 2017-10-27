import {Component, Input} from '@angular/core';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {FormGroup} from '@angular/forms';
import {DateTimeType} from '@hal-navigator/config/module-configuration';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.sass', '../form-fields.sass']
})
export class DateTimeComponent {
  @Input()
  field: FormField;

  @Input()
  form: FormGroup;

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
