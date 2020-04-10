import {FormControl, FormGroup} from '@angular/forms';
import {LoginForm} from './login-form';
import {Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

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
    this.dialogRef.close(new LoginForm(null));
  }

  onSubmit() {
    this.dialogRef.close(new LoginForm(this.form.value));
  }
}
