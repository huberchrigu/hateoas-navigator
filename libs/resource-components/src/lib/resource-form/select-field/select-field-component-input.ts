import {FieldComponentInput} from '../field-component-input';
import {UntypedFormControl} from '@angular/forms';
import {SelectField} from 'hateoas-navigator';

export interface SelectFieldComponentInput extends FieldComponentInput<SelectField, UntypedFormControl> {
}
