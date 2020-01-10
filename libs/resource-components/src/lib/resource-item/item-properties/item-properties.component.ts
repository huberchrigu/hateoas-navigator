import {Component, Input} from '@angular/core';
import {HalProperty, JsonArrayProperty, JsonResourceObject} from 'hateoas-navigator';
import {JsonArrayPropertyImpl} from 'hateoas-navigator';

@Component({
  selector: 'lib-item-properties',
  templateUrl: './item-properties.component.html',
  styleUrls: ['./item-properties.component.sass']
})
export class ItemPropertiesComponent {

  @Input()
  properties: HalProperty[];

  isArray(property: HalProperty) {
    return property instanceof JsonArrayPropertyImpl;
  }

  getArrayItems(property: HalProperty) {
    return (property as JsonArrayProperty).getArrayItems();
  }

  getChildProperties(property: HalProperty) {
    return (property as JsonResourceObject).getChildProperties();
  }
}
