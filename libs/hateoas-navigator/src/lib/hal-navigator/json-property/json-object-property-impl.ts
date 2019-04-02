import {GenericObjectValueType, JsonValueType} from './value-type/json-value-type';
import {PropDescriptor} from '../descriptor';
import {AbstractProperty} from './abstract-property';
import {JsonObjectProperty, JsonProperty} from './json-property';
import {PropertyFactory} from '../json-property/factory/property-factory';

export class JsonObjectPropertyImpl<CHILDREN extends JsonValueType, D extends PropDescriptor>
  extends AbstractProperty<GenericObjectValueType<CHILDREN>, D> implements JsonObjectProperty<CHILDREN> {

  constructor(name: string, value: GenericObjectValueType<CHILDREN>, descriptor: D, private propertyFactory: PropertyFactory<CHILDREN>) {
    super(name, value, descriptor);
  }

  getFormValue(): JsonValueType {
    return this.toObjOfMappedValues(property => property.getFormValue());
  }

  getChildProperties(): JsonProperty<CHILDREN>[] {
    return Object.keys(this.getValue()).map(key => this.propertyFactory.create(key, this.getValue()[key]));
  }

  getDisplayValue(): string | number {
    const childProperties = this.getChildProperties();
    if (childProperties.length === 0) {
      return '';
    }
    return childProperties.map(p => p.getName() + ': ' + p.getDisplayValue()).reduce((a, b) => a + ', ' + b);
  }

  /**
   * @return even a property if the value is null or undefined.
   */
  getChildProperty(propertyName: string): JsonProperty<CHILDREN> {
    const v = this.getValue()[propertyName];
    return this.propertyFactory.create(propertyName, v);
  }

  /**
   * {@link getChildProperties Gets all child properties} and transforms them with the given mapping function.
   *
   * _Is public because sub-classes of JsonObjectPropertyImpl need it, but does not need to be exported from the library._
   */
  toObjOfMappedValues<V>(propertyToValue: (property: JsonProperty<CHILDREN>) => V): { [key: string]: V } {
    const obj = {};
    this.getChildProperties().forEach(property => obj[property.getName()] = propertyToValue(property));
    return obj;
  }

  protected getPropertyFactory(): PropertyFactory<CHILDREN> {
    return this.propertyFactory;
  }
}
