import {FieldComponentInput} from '../field-component-input';
import {FormField} from 'hateoas-navigator';
import {FormControl} from '@angular/forms';

export interface InputFieldComponentInput extends FieldComponentInput<FormField, FormControl> {
  type: TypeType;
}

export type TypeType = 'text' | 'number';
