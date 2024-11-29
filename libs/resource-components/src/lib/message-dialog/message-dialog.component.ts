import {Component, Inject} from '@angular/core';
import {MessageDialogData} from './message-dialog-data';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MessageDialogResult} from './message-dialog-result';
import {CustomComponentService} from '../customizable/custom-component.service';
import {CustomizableComponentType} from '../customizable';
import {MatButton} from '@angular/material/button';
import {CommonModule, NgIf} from '@angular/common';

@Component({
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    NgIf,
    CommonModule
  ],
  templateUrl: './message-dialog.component.html',
  standalone: true
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

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.MESSAGE_DIALOG, MessageDialogComponent);
