import {FormGroup} from '@angular/forms';
import {FormField} from 'hateoas-navigator';

export interface FormGroupComponentInput {
  formGroup: FormGroup;
  fields: FormField[];
}
