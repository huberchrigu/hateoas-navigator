import {Component, Input} from '@angular/core';
import {FormField} from 'hateoas-navigator';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'lib-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.sass', '../form-fields.sass']
})
export class InputFieldComponent {
  @Input()
  field: FormField;

  @Input()
  control: FormControl;

  @Input()
  type = 'text';
}
