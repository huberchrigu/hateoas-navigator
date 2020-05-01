import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DatePickerField, DateTimeType} from 'hateoas-navigator';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {DateTimeFieldComponentInput} from './date-time-field-component-input';
import {CustomizableComponentType} from '../../customizable/custom-component-configuration';

@Component({
  templateUrl: './date-time-field.component.html',
  styleUrls: ['./date-time-field.component.sass', '../form-fields.sass']
})
export class DateTimeFieldComponent implements DateTimeFieldComponentInput {
  @Input()
  field: DatePickerField;

  @Input()
  control: FormControl;

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
