import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FormField} from 'hateoas-navigator';

@Component({
  selector: 'lib-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['../form-fields.sass', './checkbox-field.component.sass']
})
export class CheckboxFieldComponent {
  @Input()
  field: FormField;

  @Input()
  control: FormControl;

}
