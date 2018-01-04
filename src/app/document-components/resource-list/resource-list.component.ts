import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSource} from '@angular/cdk/collections';
import {VersionedResourceAdapter} from '@hal-navigator/item/versioned-resource-adapter';
import {CollectionAdapter} from '@hal-navigator/collection/collection-adapter';
import {Observable} from 'rxjs/Observable';
import {ResourceAdapter} from '@hal-navigator/hal-resource/resource-adapter';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit {

  collection: CollectionAdapter;
  propertyNames: Array<string>;

  private dataSource: DataSource<ResourceAdapter>;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data
      .map((data: ResourceListRouteData) => data.collectionAdapter)
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

  onClick(item: VersionedResourceAdapter) {
    this.router.navigateByUrl(item.getSelfLink().getRelativeUri());
  }

  /**
   * @deprecated
   */
  getDisplayValue(item: VersionedResourceAdapter, propertyName: string) {
    return item.getPropertyAs(propertyName, d => d.getDisplayValue());
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

interface ResourceListRouteData {
  collectionAdapter: CollectionAdapter;
}
