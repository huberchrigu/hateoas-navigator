import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FormFieldComponent implements OnInit {
  @Input()
  field: FormField;

  @Input()
  control: AbstractControl;

  ngOnInit(): void {
    if (!this.field) {
      throw new Error(`The control ${JSON.stringify(this.control)} has no form field definition`);
    }
    if (!this.control) {
      throw new Error(`The form field ${JSON.stringify(this.field)} has no control object`);
    }
  }

  showRequiredError(): boolean {
    return this.showError('required');
  }

  showPatternError() {
    return this.showError('pattern');
  }

  private showError(errorCode: string) {
    return this.control.touched && this.control.hasError(errorCode);
  }
}
