import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SelectField} from 'hateoas-navigator';

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['../form-fields.sass']
})
export class SelectFieldComponent {
  @Input()
  field: SelectField;

  @Input()
  control: FormControl;
}
