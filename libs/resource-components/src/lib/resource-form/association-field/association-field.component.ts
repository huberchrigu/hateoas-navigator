import {Component, Input, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {LinkField, ResourceService} from 'hateoas-navigator';
import {combineLatest, Observable, startWith, tap} from 'rxjs';
import {map} from 'rxjs/operators';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {CustomizableComponentType} from '../../customizable';
import {AssociationFieldComponentInput} from './association-field-component-input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {AsyncPipe} from '@angular/common';
import {MatInput} from '@angular/material/input';

/**
 * Currently the input's title is not shown due to https://github.com/angular/material2/issues/4863.
 */
@Component({
  templateUrl: './association-field.component.html',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    AsyncPipe,
    MatInput,
    MatLabel
  ],
  styleUrls: ['./association-field.component.sass', '../form-fields.sass'],
  standalone: true
})
export class AssociationFieldComponent implements OnInit, AssociationFieldComponentInput {
  @Input()
  field!: LinkField;

  @Input()
  control!: FormControl<string>;

  filteredItems!: Observable<Array<LinkItem>>;
  private resolvedItems: Array<LinkItem> = [];

  constructor(private halDocumentService: ResourceService) {
  }

  ngOnInit() {
    const allItems = this.initItems().pipe(
      startWith([]),
      tap((items: LinkItem[]) => this.resolvedItems = items)
    );
    const valueChanges = this.control.valueChanges.pipe(startWith(''));
    const valueAndItemsObservable = combineLatest([valueChanges, allItems]);
    this.filteredItems = valueAndItemsObservable.pipe(map(valueAndItems => this.filterValues(valueAndItems[0] as string, valueAndItems[1] as LinkItem[])));
  }

  toTitle = (name: string) => {
    if (name) {
      const item = this.resolvedItems.find(resolvedItem => resolvedItem.name === name);
      return item ? item.title : 'loading...';
    }
    return '';
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
          name: item.getSelfLink().getHref(),
          title: '' + item.getDisplayValue()
        };
      })));
  }
}

export interface LinkItem {
  name: string;
  title: string;
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.ASSOCIATION_FIELD, AssociationFieldComponent);
