import {DeprecatedPropertyDescriptor} from '../descriptor';
import {GenericArrayValueType, JsonValueType} from './value-type/json-value-type';
import {AbstractProperty} from './abstract-property';
import {JsonArrayProperty, JsonProperty} from './json-property';
import {PropertyFactory} from './factory/property-factory';

export class JsonArrayPropertyImpl<CHILDREN extends JsonValueType> extends AbstractProperty<GenericArrayValueType<CHILDREN>, DeprecatedPropertyDescriptor> implements JsonArrayProperty<CHILDREN> {
  constructor(name: string, value: GenericArrayValueType<CHILDREN>, descriptor: DeprecatedPropertyDescriptor, private propertyFactory: PropertyFactory<CHILDREN>) {
    super(name, value, descriptor);
  }

  /**
   * If this property was flagged to be a URI (i.e. it is an embedded resource object), extract the URI.
   * Transform other values otherwise.
   */
  getFormValue(): any[] {
    return this.getArrayItems().map(item => item.getFormValue());
  }

  getArrayItems(): JsonProperty<CHILDREN>[] {
    return this.getValue().map(item => this.propertyFactory.create(this.getName(), item));
  }

  getDisplayValue(): string | number {
    const arrayItems = this.getArrayItems();
    if (arrayItems.length === 0) {
      return '';
    }
    return arrayItems.map(item => item.getDisplayValue()).reduce((a, b) => a + ', ' + b);
  }
}
