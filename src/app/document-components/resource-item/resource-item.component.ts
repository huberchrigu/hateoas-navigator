import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VersionedResourceAdapter} from '@hal-navigator/item/versioned-resource-adapter';
import {ConfirmationDialogComponent} from '@document-components/confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogData} from '@document-components/confirmation-dialog/confirmation-dialog-data';
import {HalDocumentService} from '@hal-navigator/resource-services/hal-document.service';
import {MatDialog} from '@angular/material';
import {ConfirmationDialogResult} from '@document-components/confirmation-dialog/confirmation-dialog-result';

@Component({
  selector: 'app-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.sass']
})
export class ResourceItemComponent implements OnInit {

  resourceObject: VersionedResourceAdapter;

  constructor(private route: ActivatedRoute, private halDocumentService: HalDocumentService, private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { resourceObject: VersionedResourceAdapter }) => {
      this.resourceObject = data.resourceObject;
    });
  }

  getTitle() {
    return this.resourceObject.getDescriptor().getTitle();
  }

  onDelete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        title: 'Are you sure?',
        text: 'The deletion cannot be undone.'
      } as ConfirmationDialogData
    });
    dialogRef.afterClosed().subscribe((result: ConfirmationDialogResult) => {
      if (result.confirmed) {
        this.halDocumentService.deleteResource(this.resourceObject.resourceObject, this.resourceObject.getVersion())
          .subscribe(() => {
            return this.router.navigate(['..'], {relativeTo: this.route});
          });
      }
    });
  }

  isEditEnabled() {
    return this.resourceObject.getDescriptor().getActions().isUpdateEnabled();
  }

  isDeleteEnabled() {
    return this.resourceObject.getDescriptor().getActions().isDeleteEnabled();
  }
}
