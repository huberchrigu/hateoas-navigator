import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {HalDocumentService} from 'hateoas-navigator';
import {Observable} from 'rxjs';
import {LinkField} from 'hateoas-navigator';
import {startWith, map, combineLatest} from 'rxjs/operators';

/**
 * Currently the input's title is not shown due to https://github.com/angular/material2/issues/4863.
 */
@Component({
  selector: 'app-association-field',
  templateUrl: './assocation-field.component.html',
  styleUrls: ['./association-field.component.sass', '../form-fields.sass']
})
export class AssociationFieldComponent implements OnInit {
  @Input()
  field: LinkField;

  @Input()
  control: FormControl;

  filteredItems: Observable<Array<LinkItem>>;

  constructor(private halDocumentService: HalDocumentService) {
  }

  ngOnInit() {
    const allItems = this.initItems();
    this.filteredItems = this.control.valueChanges
      .pipe(
        startWith(null),
        combineLatest(allItems, (value, items) => this.filterValues(value, items)));
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
}

export interface LinkItem {
  name: string;
  title: string;
}
