import {FieldComponentInput} from '../field-component-input';
import {FormControl} from '@angular/forms';
import {SelectField} from 'hateoas-navigator';

export interface SelectFieldComponentInput extends FieldComponentInput<SelectField, FormControl> {
}
