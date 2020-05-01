import {FieldComponentInput} from '../field-component-input';
import {FormControl} from '@angular/forms';
import {DatePickerField} from 'hateoas-navigator';

export interface DateTimeFieldComponentInput extends FieldComponentInput<DatePickerField, FormControl> {
}
