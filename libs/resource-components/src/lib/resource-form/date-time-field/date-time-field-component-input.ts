import {FieldComponentInput} from '../field-component-input';
import {UntypedFormControl} from '@angular/forms';
import {DatePickerField} from 'hateoas-navigator';

export interface DateTimeFieldComponentInput extends FieldComponentInput<DatePickerField, UntypedFormControl> {
}
