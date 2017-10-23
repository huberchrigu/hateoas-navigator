import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {FormControlFactory} from '@hal-navigator/schema/form/form-control-factory';

@Component({
  selector: 'app-sub-form-array',
  templateUrl: './sub-form-array.component.html',
  styleUrls: ['./sub-form-array.component.sass']
})
export class SubFormArrayComponent implements OnInit {

  private formControlFactory = new FormControlFactory();

  @Input()
  formArray: FormArray;

  @Input()
  field: FormField;

  constructor() {
  }

  ngOnInit() {
  }

  onRemove(group: FormGroup) {
    const index = this.formArray.controls.indexOf(group);
    this.formArray.removeAt(index);
  }

  onAdd() {
    this.formArray.push(new FormGroup(
      this.formControlFactory.getControls(this.field.options.getSubFields()))
    );
  }
}
