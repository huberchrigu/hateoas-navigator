import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ResourceObjectProperty, ResourceLink, VersionedResourceObjectProperty} from 'hateoas-navigator';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogData} from '../confirmation-dialog/confirmation-dialog-data';
import {ResourceService} from 'hateoas-navigator';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogResult} from '../confirmation-dialog/confirmation-dialog-result';
import {SendDataDialogComponent} from '../send-data-dialog/send-data-dialog.component';
import {SendDataDialogData} from '../send-data-dialog/send-data-dialog-data';
import {SendDataDialogResult} from '../send-data-dialog/send-data-dialog-result';
import {ResourceObjectPropertyFactoryService} from 'hateoas-navigator';
import {flatMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ResourceListComponent} from '../resource-list/resource-list.component';

@Component({
  selector: 'lib-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.sass']
})
export class ResourceItemComponent implements OnInit {
  specialLinks: ResourceLink[] = [];
  resourceObject: VersionedResourceObjectProperty;

  constructor(private route: ActivatedRoute, private resourceService: ResourceService, private dialog: MatDialog,
              private router: Router, private resourceFactory: ResourceObjectPropertyFactoryService) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { resourceObject: VersionedResourceObjectProperty }) => {
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
      const resources = this.resourceObject.getEmbeddedResourcesOrNull(link.getRelationType());
      if (resources) {
        return this.goToResourceList(resources);
      } else {
        return this.openDialogForLink(link);
      }
    }
  }

  isLinkDisabled(link: ResourceLink): Boolean {
    const resources = this.resourceObject.getEmbeddedResourcesOrNull(link.getRelationType());
    return resources && resources.length === 0;
  }

  private openDialogForLink(link: ResourceLink): Subscription {
    const uri = link.getRelativeUriWithoutTemplatedPart();
    const options = this.resourceService.getOptionsForCustomUri(uri);
    return options.subscribe(o => this.openDialogForCustomLink(uri, o));
  }

  private goToResourceList(resources: ResourceObjectProperty[]): Promise<Boolean> {
    const queryParams = {};
    queryParams[ResourceListComponent.FILTER_PARAM] = resources.map(resource => resource.getSelfLink().extractId());
    if (resources.length === 0) {
      throw new Error('Cannot got to empty list');
    } else {
      return this.router.navigate(['/' + resources[0].getSelfLink().extractResourceName()], {queryParams});
    }
  }

  private initResource(resourceObject: VersionedResourceObjectProperty) {
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
              resource.getVersion()))
        ).subscribe(resource => this.initResource(resource));
    });
  }
}
