import {Component, Input} from '@angular/core';
import {ArrayPropertyImpl, HalProperty, JsonArrayProperty, ResourceObjectProperty} from 'hateoas-navigator';
import {CustomComponentService} from '../../customizable/custom-component.service';
import {CustomizableComponentType} from '../../customizable/custom-component-configuration';
import {CustomizableComponent} from '../../customizable';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  templateUrl: './item-properties.component.html',
  imports: [
    CustomizableComponent,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./item-properties.component.sass']
})
export class ItemPropertiesComponent implements ItemPropertiesComponentInput {

  @Input()
  properties: HalProperty[];

  isArray(property: HalProperty) {
    return property instanceof ArrayPropertyImpl;
  }

  getArrayItems(property: HalProperty) {
    return (property as JsonArrayProperty).getArrayItems();
  }

  getChildProperties(property: HalProperty) {
    return (property as ResourceObjectProperty).getChildProperties();
  }

  getItemPropertiesType() {
    return CustomizableComponentType.ITEM_PROPERTIES;
  }

  getItemPropertiesInput(child: HalProperty): ItemPropertiesComponentInput {
    return {properties: this.getChildProperties(child)};
  }
}

CustomComponentService.registerCustomizableComponent(CustomizableComponentType.ITEM_PROPERTIES, ItemPropertiesComponent);

export interface ItemPropertiesComponentInput {
  properties: HalProperty[];
}
