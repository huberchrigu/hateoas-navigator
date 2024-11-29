import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ResourceObjectProperty, ResourceLink, VersionedResourceObjectProperty} from 'hateoas-navigator';
import {ResourceService} from 'hateoas-navigator';
import {MatDialog} from '@angular/material/dialog';
import {SendDataDialogData} from './send-data-dialog';
import {SendDataDialogResult} from './send-data-dialog';
import {ResourceObjectPropertyFactoryService} from 'hateoas-navigator';
import {flatMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ResourceListComponent} from '../resource-list';
import {SendDataDialogComponent} from './send-data-dialog/send-data-dialog.component';
import {MessageService} from '../message-dialog/message.service';
import {MessageDialogData} from '../message-dialog';
import {CustomComponentService} from '../customizable/custom-component.service';
import {CustomizableComponentType} from '../customizable';
import {ItemPropertiesComponentInput} from './item-properties';
import {MatToolbar} from '@angular/material/toolbar';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitleGroup} from '@angular/material/card';
import {CustomizableComponent} from '../customizable';
import {MatAnchor, MatButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  templateUrl: './resource-item.component.html',
  imports: [
    MatToolbar,
    MatCard,
    MatCardHeader,
    MatCardContent,
    CustomizableComponent,
    MatAnchor,
    RouterLink,
    MatButton,
    NgIf,
    NgForOf,
    MatCardTitleGroup
  ],
  styleUrls: ['./resource-item.component.sass'],
  standalone: true
})
export class ResourceItemComponent implements OnInit {
  specialLinks: ResourceLink[] = [];
  resourceObject!: VersionedResourceObjectProperty;

  constructor(private route: ActivatedRoute, private resourceService: ResourceService,
              private dialog: MatDialog, private customComponentService: CustomComponentService,
              private router: Router, private resourceFactory: ResourceObjectPropertyFactoryService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    // @ts-ignore
    this.route.data.subscribe((data: { resourceObject: VersionedResourceObjectProperty }) => {
      this.initResource(data.resourceObject);
    });
  }

  getTitle() {
    return this.resourceObject.getDescriptor().getTitle();
  }

  onDelete() {
    const data = {
      title: 'Are you sure?',
      text: 'The deletion cannot be undone.'
    } as MessageDialogData;
    this.messageService.openConfirmationDialog(data, (result) => {
      if (result && result.confirmed) {
        this.resourceService.deleteResource(this.resourceObject.getValue()!, this.resourceObject.getVersion())
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
      return this.router.navigate([resource.getSelfLink().toRelativeLink().getUri()]);
    } else {
      const resources = this.resourceObject.getEmbeddedResourcesOrNull(link.getRelationType());
      if (resources) {
        return this.goToResourceList(resources);
      } else {
        return this.openDialogForLink(link);
      }
    }
  }

  isLinkDisabled(link: ResourceLink): boolean {
    const resources = this.resourceObject.getEmbeddedResourcesOrNull(link.getRelationType());
    return resources!! && resources.length === 0;
  }

  getItemPropertiesType() {
    return CustomizableComponentType.ITEM_PROPERTIES;
  }

  getItemPropertiesInput(): ItemPropertiesComponentInput {
    return {properties: this.resourceObject.getChildProperties()};
  }

  private openDialogForLink(link: ResourceLink): Subscription {
    const uri = link.toRelativeLink().getUri();
    const options = this.resourceService.getOptionsForCustomUri(uri);
    return options.subscribe(o => this.openDialogForCustomLink(uri, o));
  }

  private goToResourceList(resources: ResourceObjectProperty[]): Promise<boolean> {
    const queryParams: { [key: string]: any } = {};
    queryParams[ResourceListComponent.FILTER_PARAM] = resources.map(resource => resource.getSelfLink().getResourceId());
    if (resources.length === 0) {
      throw new Error('Cannot got to empty list');
    } else {
      return this.router.navigate(['/' + resources[0].getSelfLink().getResourceName()], {queryParams});
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
    const dialogRef = this.dialog.open(this.customComponentService.getByDefaultComponent(SendDataDialogComponent), {
      width: '600px',
      data: new SendDataDialogData(methods, this.resourceObject.getDescriptor().getDescriptorForLink(uri)!)
    });
    dialogRef.afterClosed().subscribe((result: SendDataDialogResult) => {
      if (!result || result.isCancelled()) {
        return;
      }
      return this.resourceService.executeCustomAction(uri, this.resourceObject, result.method!, result.body!)
        .pipe(
          flatMap(resource => this.resourceFactory
            .resolveDescriptorAndAssociations(resource.getName(), resource.getValue(),
              resource.getVersion()))
        ).subscribe(resource => this.initResource(resource));
    });
  }
}
