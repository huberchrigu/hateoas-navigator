import {Component, Input} from '@angular/core';
import {AbstractControl, FormArray} from '@angular/forms';
import {FormField} from 'hateoas-navigator';
import {FormControlFactory} from 'hateoas-navigator';
import {ArrayField} from 'hateoas-navigator';

@Component({
  selector: 'lib-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.sass']
})
export class FormListComponent {

  private formControlFactory = new FormControlFactory();

  @Input()
  formArray: FormArray;

  @Input()
  field: ArrayField;

  onRemove(control: AbstractControl) {
    const index = this.formArray.controls.indexOf(control);
    this.formArray.removeAt(index);
  }

  onAdd() {
    const item: FormField = this.field.getArraySpec();
    this.formArray.push(this.formControlFactory.getControl(item));
  }
}
