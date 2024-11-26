import {FieldComponentInput} from '../field-component-input';
import {FormField} from 'hateoas-navigator';
import {UntypedFormControl} from '@angular/forms';

export interface InputFieldComponentInput extends FieldComponentInput<FormField, UntypedFormControl> {
  type: TypeType;
}

export type TypeType = 'text' | 'number';
