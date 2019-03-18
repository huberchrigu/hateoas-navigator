import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSource} from '@angular/cdk/collections';
import {ResourceDescriptor, VersionedResourceAdapter} from 'hateoas-navigator';
import {CollectionAdapter} from 'hateoas-navigator';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';
import {JsonResourceObject} from 'hateoas-navigator/hal-navigator/hal-resource/resource-object';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit {

  collection: CollectionAdapter;
  propertyNames: Array<string>;

  dataSource: DataSource<JsonResourceObject>;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data
      .pipe(map((data: ResourceListRouteData) => data.collectionAdapter))
      .subscribe(collection => {
        this.initTableMetadata(collection);
        this.initDataSource(collection);
      });
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
}

interface ResourceListRouteData {
  collectionAdapter: CollectionAdapter;
}
