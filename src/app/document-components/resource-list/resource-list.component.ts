import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSource} from '@angular/cdk/collections';
import {VersionedResourceObject} from '@hal-navigator/item/versioned-resource-object';
import {CollectionAdapter} from '@hal-navigator/collection/collection-adapter';
import {Observable} from 'rxjs/Observable';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit {

  collection: CollectionAdapter;
  propertyNames: Array<string>;

  private dataSource: DataSource<ResourceObjectAdapter>;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data
      .map((data: RouteData) => data.collectionAdapter)
      .subscribe(collection => {
        this.initTableMetadata(collection);
        this.initDataSource(collection);
      });
  }

  /**
   * @deprecated
   */
  getPropertyTitle(property: string) {
    return this.collection.getDescriptor().getChild(property).getTitle();
  }

  /**
   * @deprecated
   */
  getNewLink(): string {
    return 'new';
  }

  onClick(item: VersionedResourceObject) {
    this.router.navigateByUrl(item.getSelfLink().getRelativeUri());
  }

  /**
   * @deprecated
   */
  getDisplayValue(item: VersionedResourceObject, propertyName: string) {
    return item.getData(propertyName, d => d.getDisplayValue());
  }

  private initTableMetadata(collection: CollectionAdapter) {
    this.collection = collection;
    this.propertyNames = this.collection.getPropertyNames();
  }

  private initDataSource(collection: CollectionAdapter) {
    this.dataSource = {
      connect: () => Observable.of(collection.getItems()),
      disconnect: () => {
      }
    };
  }
}

// TODO: Should be part of the resolver module
interface RouteData {
  collectionAdapter: CollectionAdapter;
}
