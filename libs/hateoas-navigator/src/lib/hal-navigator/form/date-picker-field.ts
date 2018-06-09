import {FormField} from './form-field';
import {DateTimeType} from '../config';
import {FormFieldType} from './form-field-type';

export class DatePickerField extends FormField {
  constructor(name: string, required: boolean, readOnly: boolean, title: string, private dateTimeType: DateTimeType) {
    super(name, FormFieldType.DATE_PICKER, required, readOnly, title);
    if (dateTimeType === undefined || dateTimeType === null) {
      this.dateTimeType = DateTimeType.DATE_TIME;
    }
  }

  getDateTimeType(): DateTimeType {
    return this.dateTimeType;
  }
}
