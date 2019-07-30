import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ResourceLink, VersionedResourceAdapter} from 'hateoas-navigator';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogData} from '../confirmation-dialog/confirmation-dialog-data';
import {ResourceService} from 'hateoas-navigator';
import {MatDialog} from '@angular/material';
import {ConfirmationDialogResult} from '../confirmation-dialog/confirmation-dialog-result';
import {SendDataDialogComponent} from '../send-data-dialog/send-data-dialog.component';
import {SendDataDialogData} from '../send-data-dialog/send-data-dialog-data';
import {SendDataDialogResult} from '../send-data-dialog/send-data-dialog-result';
import {VersionedJsonResourceObject} from 'hateoas-navigator/hal-navigator/hal-resource/resource-object';
import {ResourceAdapterFactoryService} from 'hateoas-navigator/hal-navigator/hal-resource/resource-adapter-factory.service';
import {flatMap} from 'rxjs/operators';

@Component({
  selector: 'lib-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.sass']
})
export class ResourceItemComponent implements OnInit {
  specialLinks: ResourceLink[] = [];
  resourceObject: VersionedJsonResourceObject;

  constructor(private route: ActivatedRoute, private resourceService: ResourceService, private dialog: MatDialog,
              private router: Router, private resourceFactory: ResourceAdapterFactoryService) {
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
        this.resourceService.deleteResource(this.resourceObject.getValue(), this.resourceObject.getVersion())
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
      const uri = link.getRelativeUriWithoutTemplatedPart();
      const options = this.resourceService.getOptionsForCustomUri(uri);
      options.subscribe(o => this.openDialogForCustomLink(uri, o));
    }
  }

  private initResource(resourceObject: VersionedJsonResourceObject) {
    if (!resourceObject) {
      throw new Error(`No resource object provided!`);
    }
    this.resourceObject = resourceObject;
    this.specialLinks.splice(0, this.specialLinks.length, ...resourceObject.getOtherLinks());
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
      return this.resourceService.executeCustomAction(uri, this.resourceObject, result.method, result.body)
        .pipe(
          flatMap(resource => this.resourceFactory
            .resolveDescriptorAndAssociations(resource.getName(), resource.getValue(),
              'unknown')) // TODO: Version should be known - or else do not use versioned resources
        ).subscribe(resource => this.initResource(resource));
    });
  }
}