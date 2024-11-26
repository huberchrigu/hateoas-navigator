import {LinkField} from 'hateoas-navigator';
import {UntypedFormControl} from '@angular/forms';
import {FieldComponentInput} from '../field-component-input';

export interface AssociationFieldComponentInput extends FieldComponentInput<LinkField, UntypedFormControl> {
}
