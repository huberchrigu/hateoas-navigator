import {Component, Input} from '@angular/core';
import {JsonObjectProperty, JsonProperty} from 'hateoas-navigator/hal-navigator/json-property/json-property';
import {HalValueType} from 'hateoas-navigator/hal-navigator/hal-resource/value-type/hal-value-type';
import {JsonArrayPropertyImpl} from 'hateoas-navigator/hal-navigator/json-property/json-array-property-impl';

@Component({
  selector: 'lib-item-properties',
  templateUrl: './item-properties.component.html',
  styleUrls: ['./item-properties.component.sass']
})
export class ItemPropertiesComponent {

  @Input()
  properties: JsonProperty<HalValueType>[];

  isArray(property: JsonProperty<HalValueType>) {
    return property instanceof JsonArrayPropertyImpl;
  }

  getArrayItems(property: JsonProperty<HalValueType>) {
    return (property as JsonArrayPropertyImpl<HalValueType>).getArrayItems();
  }

  getChildProperties(property: JsonProperty<HalValueType>) {
    return (property as JsonObjectProperty<HalValueType>).getChildProperties();
  }
}
