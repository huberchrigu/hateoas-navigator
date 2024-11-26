import {FieldComponentInput} from '../field-component-input';
import {UntypedFormArray} from '@angular/forms';
import {ArrayField} from 'hateoas-navigator';

export interface FormListComponentInput extends FieldComponentInput<ArrayField, UntypedFormArray> {
}
