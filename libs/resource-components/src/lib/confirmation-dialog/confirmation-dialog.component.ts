import {Component, Inject} from '@angular/core';
import {ConfirmationDialogData} from './confirmation-dialog-data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ConfirmationDialogResult} from './confirmation-dialog-result';

@Component({
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent {

  constructor(private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {
  }

  onCancel() {
    this.dialogRef.close(new ConfirmationDialogResult(false));
  }

  onOk() {
    this.dialogRef.close(new ConfirmationDialogResult(true));
  }
}
