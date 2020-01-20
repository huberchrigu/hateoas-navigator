import {GenericObjectValueType, JsonValueType} from '../value-type/json-value-type';
import {AbstractProperty} from '../abstract-property';
import {ObjectProperty} from './object-property';
import {PropertyFactory} from '../../json-property/factory/property-factory';
import {ObjectPropertyDescriptor, PropDescriptor} from '../../descriptor/prop-descriptor';
import {GenericProperty} from '../generic-property';

export class ObjectPropertyImpl<CHILDREN extends JsonValueType, D extends ObjectPropertyDescriptor>
  extends AbstractProperty<GenericObjectValueType<CHILDREN>, D> implements ObjectProperty<CHILDREN> {

  constructor(name: string, value: GenericObjectValueType<CHILDREN>,
              descriptor: D, private propertyFactory: PropertyFactory<CHILDREN>) {
    super(name, value, descriptor);
  }

  getFormValue(): JsonValueType {
    return this.toObjOfMappedValues(property => property.getFormValue());
  }

  getChildProperties(): GenericProperty<CHILDREN, PropDescriptor>[] {
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
  getChildProperty(propertyName: string): GenericProperty<CHILDREN, PropDescriptor> {
    const v = this.getValue()[propertyName];
    return this.propertyFactory.create(propertyName, v);
  }

  /**
   * {@link getChildProperties Gets all child properties} and transforms them with the given mapping function.
   *
   * _Is public because sub-classes of ObjectPropertyImpl need it, but does not need to be exported from the library._
   */
  toObjOfMappedValues<V>(propertyToValue: (property: GenericProperty<CHILDREN, PropDescriptor>) => V): { [key: string]: V } {
    const obj = {};
    this.getChildProperties().forEach(property => obj[property.getName()] = propertyToValue(property));
    return obj;
  }

  protected getPropertyFactory(): PropertyFactory<CHILDREN> {
    return this.propertyFactory;
  }
}
