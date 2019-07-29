import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSource} from '@angular/cdk/collections';
import {ResourceDescriptor, ResourceService, VersionedResourceAdapter} from 'hateoas-navigator';
import {CollectionAdapter} from 'hateoas-navigator';
import {of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {JsonResourceObject} from 'hateoas-navigator/hal-navigator/hal-resource/resource-object';
import {MatDialog} from '@angular/material';
import {ResourceSearchDialogComponent} from 'resource-components/resource-list/search-dialog/resource-search-dialog.component';
import {ResourceSearchDialogData} from 'resource-components/resource-list/search-dialog/resource-search-dialog-data';
import {ResourceSearchDialogResult} from 'resource-components/resource-list/search-dialog/resource-search-dialog-result';

@Component({
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit {

  collection: CollectionAdapter;
  propertyNames: Array<string>;

  dataSource: DataSource<JsonResourceObject>;

  constructor(private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.route.data
      .pipe(map((data: ResourceListRouteData) => data.collectionAdapter))
      .subscribe(collection => {
        this.initCollection(collection);
      });
  }

  private initCollection(collection) {
    this.initTableMetadata(collection);
    this.initDataSource(collection);
  }

  /**
   * @deprecated
   */
  getPropertyTitle(property: string) {
    return this.collection.getDescriptor().getChildDescriptor(property).getTitle();
  }

  /**
   * @deprecated
   */
  getNewLink(): string {
    return 'new';
  }

  onClick(item: VersionedResourceAdapter) {
    this.router.navigateByUrl(item.getSelfLink().getRelativeUri());
  }

  /**
   * @deprecated
   */
  getDisplayValue(item: VersionedResourceAdapter, propertyName: string) {
    return item.getChildProperty(propertyName).getDisplayValue();
  }

  isAddEnabled() {
    const descriptor: ResourceDescriptor = this.collection.getDescriptor();
    return descriptor.getActions().isCreateEnabled();
  }

  private initTableMetadata(collection: CollectionAdapter) {
    this.collection = collection;
    this.propertyNames = this.collection.getPropertyNames();
  }

  private initDataSource(collection: CollectionAdapter) {
    this.dataSource = {
      connect: () => of(collection.getItems()),
      disconnect: () => {
      }
    };
  }

  clickSearchModal() {
    this.collection.getSearchUrls(this.resourceService).subscribe(urls => {
      const dialogRef = this.dialog.open(ResourceSearchDialogComponent, {data: new ResourceSearchDialogData(urls)});
      dialogRef.afterClosed().subscribe((result: ResourceSearchDialogResult) => {
        if (result && !result.isCancelled()) {
          this.updateCollection(result.uri);
        }
      });
    });
  }

  private updateCollection(resourceUri: string) {
    this.resourceService.getCustomCollection(this.collection.getResourceName(), resourceUri).pipe(
      flatMap(collection => collection.resolve())
    ).subscribe(collection => this.initCollection(collection));
  }
}

interface ResourceListRouteData {
  collectionAdapter: CollectionAdapter;
}
