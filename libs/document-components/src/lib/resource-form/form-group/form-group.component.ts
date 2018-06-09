import {Component, Input, OnInit} from '@angular/core';
import {FormField} from 'hateoas-navigator';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.sass']
})
export class FormGroupComponent implements OnInit {
  @Input()
  fields: FormField[];

  @Input()
  formGroup: FormGroup;

  ngOnInit(): void {
    if (!this.formGroup.controls) {
      throw new Error(`Erroneous type for sub-form: ${this.formGroup.constructor.name}`);
    }
  }
}
