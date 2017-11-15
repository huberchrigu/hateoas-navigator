import {Component, Input} from '@angular/core';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['../form-fields.sass']
})
export class SelectFieldComponent {
  @Input()
  field: FormField;

  @Input()
  control: FormControl;
}
