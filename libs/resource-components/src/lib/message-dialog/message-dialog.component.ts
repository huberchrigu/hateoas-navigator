import {Component, Inject} from '@angular/core';
import {MessageDialogData} from './message-dialog-data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MessageDialogResult} from './message-dialog-result';

@Component({
  templateUrl: './message-dialog.component.html'
})
export class MessageDialogComponent {

  constructor(private dialogRef: MatDialogRef<MessageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MessageDialogData) {
  }

  onCancel() {
    this.dialogRef.close(new MessageDialogResult(false));
  }

  onOk() {
    this.dialogRef.close(new MessageDialogResult(true));
  }
}
