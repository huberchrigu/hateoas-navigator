import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSource} from '@angular/cdk/collections';
import {VersionedResourceObject} from '@hal-navigator/item/versioned-resource-object';
import {CollectionAdapter} from '@hal-navigator/collection/collection-adapter';
import {Observable} from 'rxjs/Observable';
import {SchemaAdapter} from '@hal-navigator/schema/schema-adapter';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit {

  propertyNames: Array<string> = [];

  private dataSource: DataSource<ResourceObjectAdapter>;
  private resourceName: string;
  private schema: SchemaAdapter;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const listObservable = this.route.data.map((data: RouteData) => data.collectionAdapter);
    this.initTableMetadata(listObservable);
    this.initDataSource(listObservable);
    this.route.data.subscribe((data: RouteData) => this.schema = data.schemaAdapter);
  }

  getPropertyTitle(property: string) {
    return this.schema.getSchema().properties[property].title;
  }

  getTitle() {
    return this.schema.getTitle();
  }

  getNewLink(): string {
    return 'new';
  }

  onClick(item: VersionedResourceObject) {
    this.router.navigateByUrl(item.getSelfLink().getRelativeUri());
  }

  getDisplayValue(item: VersionedResourceObject, propertyName: string) {
    return item.getData(propertyName, d => d.getDisplayValue());
  }

  private initTableMetadata(collectionObservable: Observable<CollectionAdapter>) {
    collectionObservable.subscribe(collectionAdapter => {
      this.propertyNames = collectionAdapter.getPropertyNames();
      this.resourceName = collectionAdapter.getResourceName();
    });
  }

  private initDataSource(collectionObservable: Observable<CollectionAdapter>) {
    this.dataSource = {
      connect: () => collectionObservable.map(collectionAdapter => collectionAdapter.getItems()),
      disconnect: () => {
      }
    };
  }
}

interface RouteData {
  collectionAdapter: CollectionAdapter;
  schemaAdapter: SchemaAdapter;
}
