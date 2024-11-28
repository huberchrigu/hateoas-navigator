import {FormField} from './form-field';
import {DateTimeType} from '../config';
import {FormFieldType} from './form-field-type';

export class DatePickerField extends FormField {
  constructor(name: string | undefined, required: boolean | undefined, readOnly: boolean | undefined, title: string | undefined, private readonly dateTimeType: DateTimeType | undefined) {
    super(name, FormFieldType.DATE_PICKER, required, readOnly, title);
    if (dateTimeType === undefined || dateTimeType === null) {
      this.dateTimeType = DateTimeType.DATE_TIME;
    }
  }

  getDateTimeType(): DateTimeType {
    return this.dateTimeType!;
  }
}
