import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSource} from '@angular/cdk/collections';
import {ResourceObjectProperty, ResourceObjectDescriptor, ResourceService, VersionedResourceObjectProperty} from 'hateoas-navigator';
import {CollectionAdapter} from 'hateoas-navigator';
import {combineLatest, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ResourceSearchDialogComponent} from './search-dialog/resource-search-dialog.component';
import {ResourceSearchDialogData} from './search-dialog/resource-search-dialog-data';
import {ResourceSearchDialogResult} from './search-dialog/resource-search-dialog-result';

@Component({
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private resourceService: ResourceService) {
  }

  static FILTER_PARAM = 'filter';

  collection: CollectionAdapter;
  propertyNames: Array<string>;

  dataSource: DataSource<ResourceObjectProperty>;

  ngOnInit() {
    combineLatest([
      this.route.data.pipe(map((data: ResourceListRouteData) => data.collectionAdapter)),
      this.route.queryParams.pipe(map(params => params[ResourceListComponent.FILTER_PARAM]))
    ]).subscribe(([collection, ids]) => {
      this.initCollection(collection, ids && !Array.isArray(ids) ? [ids] : ids);
    });
  }

  private initCollection(collection, ids: string[] = null) {
    this.initTableMetadata(collection);
    this.initDataSource(collection, ids);
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

  onClick(item: VersionedResourceObjectProperty) {
    return this.router.navigateByUrl(item.getSelfLink().toRelativeLink().getUri());
  }

  /**
   * @deprecated
   */
  getDisplayValue(item: VersionedResourceObjectProperty, propertyName: string) {
    return item.getChildProperty(propertyName).getDisplayValue();
  }

  isAddEnabled() {
    const descriptor: ResourceObjectDescriptor = this.collection.getDescriptor();
    return descriptor.getActions().isCreateEnabled();
  }

  clickSearchModal() {
    this.collection.getSearchUrls(this.resourceService).subscribe(urls => {
      const dialogRef = this.dialog.open(ResourceSearchDialogComponent, {
        data: new ResourceSearchDialogData(urls, this.collection.getDescriptor())
      });
      dialogRef.afterClosed().subscribe((result: ResourceSearchDialogResult) => {
        if (result && !result.isCancelled()) {
          this.updateCollection(result.uri);
        }
      });
    });
  }

  private initTableMetadata(collection: CollectionAdapter) {
    this.collection = collection;
    this.propertyNames = this.collection.getPropertyNames();
  }

  private initDataSource(collection: CollectionAdapter, ids: string[]) {
    this.dataSource = {
      connect: () => of(ids ? collection.filterByIds(ids) : collection.getItems()),
      disconnect: () => {
      }
    };
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
