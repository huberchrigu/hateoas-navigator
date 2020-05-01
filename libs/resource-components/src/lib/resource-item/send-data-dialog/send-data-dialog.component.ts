import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SendDataDialogData} from './send-data-dialog-data';
import {SendDataDialogResult} from './send-data-dialog-result';
import {FormGroup} from '@angular/forms';
import {FormControlFactory, FormField, SubFormField} from 'hateoas-navigator';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {CustomizableComponentType} from '../../customizable/custom-component-configuration';
import {FormGroupComponentInput} from '../../resource-form/form-group/form-group-component-input';

@Component({
  templateUrl: './send-data-dialog.component.html'
})
export class SendDataDialogComponent {

  fields: FormField[];
  title: string;
  form: FormGroup;

  private readonly methods: string[];

  constructor(private dialogRef: MatDialogRef<SendDataDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: SendDataDialogData) {
    if (data.descriptor) {
      this.title = data.descriptor.getTitle();
      this.fields = (data.descriptor.toFormFieldBuilder().build() as SubFormField).getSubFields();
    } else {
      this.title = '';
      this.fields = [];
    }
    this.form = new FormGroup(new FormControlFactory().getControls(this.fields));
    this.methods = data.methods;
  }

  onCancel() {
    this.dialogRef.close(new SendDataDialogResult(null, null));
  }

  onSubmit() {
    this.dialogRef.close(new SendDataDialogResult(this.methods[0], this.getBody())); // TODO: Method should be chosen by user
  }

  getFormGroupType() {
    return CustomizableComponentType.FORM_GROUP;
  }

  getFormGroupInput(): FormGroupComponentInput {
    return {fields: this.fields, formGroup: this.form};
  }

  private getBody() {
    return this.form.value;
  }
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.SEND_DATA_DIALOG, SendDataDialogComponent);
