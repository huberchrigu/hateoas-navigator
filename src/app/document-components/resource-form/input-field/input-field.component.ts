import {Component, Input} from '@angular/core';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.sass', '../form-fields.sass']
})
export class InputFieldComponent {
  @Input()
  field: FormField;

  @Input()
  form: FormGroup;

  @Input()
  type = 'text';
}
