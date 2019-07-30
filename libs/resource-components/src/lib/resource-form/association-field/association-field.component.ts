import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ResourceService} from 'hateoas-navigator';
import {combineLatest, Observable} from 'rxjs';
import {LinkField} from 'hateoas-navigator';
import {startWith, map} from 'rxjs/operators';

/**
 * Currently the input's title is not shown due to https://github.com/angular/material2/issues/4863.
 */
@Component({
  selector: 'lib-association-field',
  templateUrl: './association-field.component.html',
  styleUrls: ['./association-field.component.sass', '../form-fields.sass']
})
export class AssociationFieldComponent implements OnInit {
  @Input()
  field: LinkField;

  @Input()
  control: FormControl;

  filteredItems: Observable<Array<LinkItem>>;
  private resolvedItems: Array<LinkItem> = [];

  constructor(private halDocumentService: ResourceService) {
  }

  ngOnInit() {
    const allItems = this.initItems();
    const valueChanges = this.control.valueChanges.pipe(startWith(null));
    const valueAndItemsObservable = combineLatest(valueChanges, allItems);
    this.filteredItems = valueAndItemsObservable.pipe(map(valueAndItems => this.filterValues(valueAndItems[0], valueAndItems[1])));
    this.initItems().subscribe(all => {
      this.updateItems(all);
    });
  }

  toTitle(): (name: string) => string {
    return name => {
      if (name) {
        const item = this.resolvedItems.find(resolvedItem => resolvedItem.name === name);
        return item ? item.title : 'loading...';
      }
      return null;
    };
  }

  private filterValues(value: string, items: Array<LinkItem>): Array<LinkItem> {
    if (value) {
      return items.filter(item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1);
    } else {
      return items;
    }
  }

  private initItems(): Observable<Array<LinkItem>> {
    return this.halDocumentService.getCollection(this.field.getLinkedResource()).pipe(
      map(collection => collection.getItems()),
      map(items => items.map(item => {
        return {
          name: item.getSelfLink().getFullUri(),
          title: '' + item.getDisplayValue()
        };
      })));
  }

  /**
   * Set the value of the control again, so that change detection is triggered.
   */
  private updateItems(all) {
    this.resolvedItems.push(...all);
    this.control.setValue(this.control.value);
  }
}

export interface LinkItem {
  name: string;
  title: string;
}
