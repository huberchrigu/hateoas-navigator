import {ReactiveFormsModule, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {LoginDialogResult} from './login-dialog-result';
import {Component} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {CustomizableComponentType} from '../../customizable/custom-component-configuration';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatAnchor, MatButton} from '@angular/material/button';

@Component({
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatInput,
    MatDialogActions,
    MatAnchor,
    MatButton
  ],
  templateUrl: './login-dialog.component.html'
})
export class LoginDialogComponent {

  constructor(private dialogRef: MatDialogRef<LoginDialogComponent>) {
  }

  form = new UntypedFormGroup({
    username: new UntypedFormControl(),
    password: new UntypedFormControl()
  });

  onCancel() {
    this.dialogRef.close(new LoginDialogResult(null));
  }

  onSubmit() {
    this.dialogRef.close(new LoginDialogResult(this.form.value));
  }
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.LOGIN_DIALOG, LoginDialogComponent);
