import {FormField} from '@hal-navigator/form/form-field';
import {FormFieldType} from '@hal-navigator/form/form-field-type';
import {DateTimeType} from '@hal-navigator/config/module-configuration';

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
