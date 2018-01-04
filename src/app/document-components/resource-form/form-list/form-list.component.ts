import {Component, Input} from '@angular/core';
import {AbstractControl, FormArray} from '@angular/forms';
import {FormField} from '@hal-navigator/form/form-field';
import {FormControlFactory} from '@hal-navigator/form/form-control-factory';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.sass']
})
export class FormListComponent {

  private formControlFactory = new FormControlFactory();

  @Input()
  formArray: FormArray;

  @Input()
  field: FormField;

  onRemove(control: AbstractControl) {
    const index = this.formArray.controls.indexOf(control);
    this.formArray.removeAt(index);
  }

  onAdd() {
    const item: FormField = this.field.options.getArraySpec();
    this.formArray.push(this.formControlFactory.getControl(item));
  }
}
