import {Component, Input} from '@angular/core';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.sass', '../form-fields.sass']
})
export class DateTimeComponent {
  @Input()
  field: FormField;

  @Input()
  form: FormGroup;
}
