import {FormField} from 'hateoas-navigator';
import {AbstractControl} from '@angular/forms';

export interface FieldComponentInput<F extends FormField, C extends AbstractControl> {
  field: F;
  control: C;
}
