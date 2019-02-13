import {GenericObjectValueType, JsonValueType} from './value-type/json-value-type';
import {DeprecatedPropertyDescriptor} from '../descriptor';
import {AbstractProperty} from './abstract-property';
import {JsonObjectProperty, JsonProperty} from './json-property';
import {PropertyFactory} from '../json-property/factory/property-factory';

export class JsonObjectPropertyImpl<CHILDREN extends JsonValueType, D extends DeprecatedPropertyDescriptor> extends AbstractProperty<GenericObjectValueType<CHILDREN>, D>
  implements JsonObjectProperty<CHILDREN> {

  constructor(name: string, value: GenericObjectValueType<CHILDREN>, descriptor: D, private propertyFactory: PropertyFactory<CHILDREN>) {
    super(name, value, descriptor);
  }

  getFormValue(): JsonValueType {
    return this.toObj(property => property.getFormValue());
  }

  getChildProperties(): JsonProperty<CHILDREN>[] {
    return Object.keys(this.getValue()).map(key => this.propertyFactory.create(key, this.getValue()[key]));
  }

  getDisplayValue(): string | number {
    const childProperties = this.getChildProperties();
    if (childProperties.length === 0) {
      return '';
    }
    return childProperties.map(p => p.getName() + ": " + p.getDisplayValue()).reduce((a, b) => a + ", " + b);
  }

  toObj<V>(propertyToValue: (property: JsonProperty<CHILDREN>) => V): { [key: string]: V } {
    const obj = {};
    this.getChildProperties().forEach(property => obj[property.getName()] = propertyToValue(property));
    return obj;
  }

  /**
   * @return even a property if the value is null or undefined.
   */
  getChildProperty(propertyName: string): JsonProperty<CHILDREN> {
    const v = this.getValue()[propertyName];
    return this.propertyFactory.create(propertyName, v);
  }

  protected getPropertyFactory(): PropertyFactory<CHILDREN> {
    return this.propertyFactory;
  }
}
