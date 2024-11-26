import {UntypedFormGroup} from '@angular/forms';
import {FormField} from 'hateoas-navigator';

export interface FormGroupComponentInput {
  formGroup: UntypedFormGroup;
  fields: FormField[];
}
