import {Component, Input, OnInit} from '@angular/core';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-sub-form',
  templateUrl: './sub-form.component.html',
  styleUrls: ['./sub-form.component.sass']
})
export class SubFormComponent implements OnInit {
  @Input()
  fields: FormField[];

  @Input()
  private form: FormGroup;

  ngOnInit(): void {
    if (!this.form.controls) {
      throw new Error(`Erroneous type for sub-form: ${this.form.constructor.name}`);
    }
  }

  showRequiredError(field: FormField): boolean {
    return this.showError(field, 'required');
  }

  showPatternError(field: FormField) {
    return this.showError(field, 'pattern');
  }

  private showError(field: FormField, errorCode: string) {
    const control = this.form.get(field.name);
    return control.touched && control.hasError(errorCode);
  }
}
