import {MessageDialogComponent} from './message-dialog.component';
import {MessageDialogResult} from './message-dialog-result';
import { MatDialog } from '@angular/material/dialog';
import {MessageDialogData} from './message-dialog-data';
import {Injectable} from '@angular/core';

/**
 * Generic service top open {@link MatDialog dialogs} with a title, text, OK button and - optionally - a cancel button.
 */
@Injectable({providedIn: 'root'})
export class MessageService {
  constructor(private dialog: MatDialog) {
  }

  openMessageDialog(data: MessageDialogData, onClose?: (result: MessageDialogResult) => void) {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '250px',
      data
    });
    dialogRef.afterClosed().subscribe((result: MessageDialogResult) => onClose ? onClose(result) : {});
  }

  openConfirmationDialog(data: MessageDialogData, onClose?: (result: MessageDialogResult) => void) {
    data.enableCancel = true;
    this.openMessageDialog(data, onClose);
  }
}
