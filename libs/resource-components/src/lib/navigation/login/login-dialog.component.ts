import {FormControl, FormGroup} from '@angular/forms';
import {LoginDialogResult} from './login-dialog-result';
import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {CustomizableComponentType} from '../../customizable/custom-component-configuration';
import {CustomComponentService} from '../../customizable/custom-component.service';

@Component({
  templateUrl: './login-dialog.component.html'
})
export class LoginDialogComponent {

  constructor(private dialogRef: MatDialogRef<LoginDialogComponent>) {
  }

  form = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });

  onCancel() {
    this.dialogRef.close(new LoginDialogResult(null));
  }

  onSubmit() {
    this.dialogRef.close(new LoginDialogResult(this.form.value));
  }
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.LOGIN_DIALOG, LoginDialogComponent);
