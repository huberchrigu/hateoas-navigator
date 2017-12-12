import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VersionedResourceObject} from '@hal-navigator/item/versioned-resource-object';
import {ConfirmationDialogComponent} from '@document-components/confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogData} from '@document-components/confirmation-dialog/confirmation-dialog-data';
import {HalDocumentService} from '@hal-navigator/resource-services/hal-document.service';
import {MatDialog} from '@angular/material';
import {ConfirmationDialogResult} from '@document-components/confirmation-dialog/confirmation-dialog-result';
import {SchemaAdapter} from '@hal-navigator/schema/schema-adapter';

@Component({
  selector: 'app-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.sass']
})
export class ResourceItemComponent implements OnInit {

  private schemaAdapter: SchemaAdapter;

  resourceObject: VersionedResourceObject;

  constructor(private route: ActivatedRoute, private halDocumentService: HalDocumentService, private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { resourceObject: VersionedResourceObject, schemaAdapter: SchemaAdapter }) => {
      this.resourceObject = data.resourceObject;
      this.schemaAdapter = data.schemaAdapter;
    });
  }
  /**
   * @deprecated
   */
  getTitle() {
    return this.schemaAdapter.getTitle();
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
}
