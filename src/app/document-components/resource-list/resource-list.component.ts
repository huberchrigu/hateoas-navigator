import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSource} from '@angular/cdk/collections';
import {ItemAdapter} from '@hal-navigator/item/item-adapter';
import {CollectionAdapter} from '@hal-navigator/collection/collection-adapter';
import {Observable} from 'rxjs/Observable';
import {SchemaAdapter} from '@hal-navigator/schema/schema-adapter';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit {

  propertyNames: Array<string> = [];

  private dataSource: DataSource<ItemAdapter>;
  private resourceName: string;
  private schema: SchemaAdapter;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const listObservable = this.route.data.map((data: RouteData) => data.listAdapter);
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

  onClick(item: ItemAdapter) {
    this.router.navigateByUrl(item.getDetailLink());
  }

  getDisplayValue(item: ItemAdapter, propertyName: string) {
    return item.getProperty(propertyName).getDisplayValue();
  }

  private initTableMetadata(listObservable: Observable<CollectionAdapter>) {
    listObservable.subscribe(listAdapter => {
      this.propertyNames = listAdapter.getPropertyNames();
      this.resourceName = listAdapter.getResourceName();
    });
  }

  private initDataSource(listObservable: Observable<CollectionAdapter>) {
    this.dataSource = {
      connect: () => listObservable.map(listAdapter => listAdapter.getItems()),
      disconnect: () => {
      }
    };
  }
}

interface RouteData {
  listAdapter: CollectionAdapter;
  schemaAdapter: SchemaAdapter;
}
