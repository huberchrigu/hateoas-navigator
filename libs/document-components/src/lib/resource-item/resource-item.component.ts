import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ResourceLink, VersionedResourceAdapter} from 'hateoas-navigator';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogData} from '../confirmation-dialog/confirmation-dialog-data';
import {HalDocumentService} from 'hateoas-navigator';
import {MatDialog} from '@angular/material';
import {ConfirmationDialogResult} from '../confirmation-dialog/confirmation-dialog-result';
import {SendDataDialogComponent} from "document-components/send-data-dialog/send-data-dialog.component";
import {SendDataDialogData} from "document-components/send-data-dialog/send-data-dialog-data";
import {SendDataDialogResult} from "document-components/send-data-dialog/send-data-dialog-result";

@Component({
  selector: 'app-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.sass']
})
export class ResourceItemComponent implements OnInit {
  specialLinks: ResourceLink[] = [];
  resourceObject: VersionedResourceAdapter;

  constructor(private route: ActivatedRoute, private halDocumentService: HalDocumentService, private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { resourceObject: VersionedResourceAdapter }) => {
      this.initResource(data.resourceObject);
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
      if (result && result.confirmed) {
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

  clickLink(link: ResourceLink) {
    const resource = this.resourceObject.getEmbeddedResourceOrNull(link.getRelationType());
    if (resource) {
      return this.router.navigate([resource.getSelfLink().getRelativeUriWithoutTemplatedPart()]);
    } else {
      let uri = link.getRelativeUriWithoutTemplatedPart();
      const options = this.halDocumentService.getOptionsForCustomUri(uri);
      options.subscribe(options => this.openDialogForCustomLink(uri, options));
    }
  }

  private initResource(resourceObject: VersionedResourceAdapter) {
    this.resourceObject = resourceObject;
    this.specialLinks.splice(0, this.specialLinks.length, ...this.resourceObject.getOtherLinks());
  }

  private openDialogForCustomLink(uri: string, methods: string[]) {
    const dialogRef = this.dialog.open(SendDataDialogComponent, {
      width: '600px',
      data: new SendDataDialogData(methods, this.resourceObject.getDescriptor().getDescriptorForLink(uri))
    });
    dialogRef.afterClosed().subscribe((result: SendDataDialogResult) => {
      if (!result || result.isCancelled()) {
        return;
      }
      return this.halDocumentService.executeCustomAction(uri, this.resourceObject, result.method, result.body).subscribe(resource => this.initResource(resource));
    });
  }
}
