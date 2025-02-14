import {FieldComponentInput} from '../field-component-input';
import {FormField} from 'hateoas-navigator';
import {UntypedFormControl} from '@angular/forms';

export interface CheckboxFieldComponentInput extends FieldComponentInput<FormField, UntypedFormControl> {
}
