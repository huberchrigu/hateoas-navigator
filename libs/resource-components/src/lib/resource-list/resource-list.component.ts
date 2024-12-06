import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data, Router, RouterLink} from '@angular/router';
import {DataSource} from '@angular/cdk/collections';
import {
  ResourceObjectProperty,
  ResourceObjectDescriptor,
  ResourceService,
  VersionedResourceObjectProperty,
  CollectionAdapter
} from 'hateoas-navigator';
import {combineLatest, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ResourceSearchDialogComponent} from './search-dialog/resource-search-dialog.component';
import {ResourceSearchDialogData} from './search-dialog';
import {ResourceSearchDialogResult} from './search-dialog';
import {CustomComponentService} from '../customizable/custom-component.service';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable} from '@angular/material/table';
import {MatToolbar} from '@angular/material/toolbar';
import {MatAnchor, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  templateUrl: './resource-list.component.html',
  imports: [
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatToolbar,
    MatAnchor,
    RouterLink,
    MatIconButton,
    MatIcon,
    MatTable,
    MatColumnDef,
    NgForOf,
    NgIf,
    MatHeaderRowDef,
    MatHeaderCellDef,
    MatCellDef,
    MatRowDef
  ],
  styleUrls: ['./resource-list.component.css'],
  standalone: true
})
export class ResourceListComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute,
              private dialog: MatDialog, private customComponentService: CustomComponentService,
              private resourceService: ResourceService) {
  }

  static FILTER_PARAM = 'filter';

  collection!: CollectionAdapter;
  propertyNames!: Array<string>;

  dataSource!: DataSource<ResourceObjectProperty>;

  ngOnInit() {
    combineLatest([
      this.route.data.pipe(map((data: ResourceListRouteData | Data) => data.collectionAdapter)),
      this.route.queryParams.pipe(map(params => params[ResourceListComponent.FILTER_PARAM]))
    ]).subscribe(([collection, ids]) => {
      this.initCollection(collection, ids && !Array.isArray(ids) ? [ids] : ids);
    });
  }

  private initCollection(collection: CollectionAdapter, ids: string[] | null = null) {
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
    return item.getChildProperty(propertyName)!.getDisplayValue();
  }

  isAddEnabled() {
    const descriptor: ResourceObjectDescriptor = this.collection.getDescriptor();
    return descriptor.getActions().isCreateEnabled();
  }

  clickSearchModal() {
    this.collection.getSearchUrls(this.resourceService).subscribe(urls => {
      const dialogRef = this.dialog.open(this.customComponentService.getByDefaultComponent(ResourceSearchDialogComponent), {
        data: new ResourceSearchDialogData(urls, this.collection.getDescriptor())
      });
      dialogRef.afterClosed().subscribe((result: ResourceSearchDialogResult) => {
        if (result && !result.isCancelled()) {
          this.updateCollection(result.uri!);
        }
      });
    });
  }

  private initTableMetadata(collection: CollectionAdapter) {
    this.collection = collection;
    this.propertyNames = this.collection.getPropertyNames();
  }

  private initDataSource(collection: CollectionAdapter, ids: string[] | null) {
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
