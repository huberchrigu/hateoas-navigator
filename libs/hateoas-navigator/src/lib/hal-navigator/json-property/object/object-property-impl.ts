import {GenericObjectValueType, JsonValueType} from '../value-type';
import {AbstractProperty} from '../abstract-property';
import {ObjectProperty} from './object-property';
import {PropertyFactory} from '../factory/property-factory';
import {ObjectDescriptor, GenericPropertyDescriptor} from '../../descriptor/generic-property-descriptor';
import {GenericProperty} from '../generic-property';

export class ObjectPropertyImpl<CHILDREN extends JsonValueType, D extends ObjectDescriptor> extends AbstractProperty<GenericObjectValueType<CHILDREN>, D> implements ObjectProperty<CHILDREN> {

  constructor(name: string, value: GenericObjectValueType<CHILDREN> | null,
              descriptor: D | null, private propertyFactory: PropertyFactory<CHILDREN>) {
    super(name, value, descriptor);
  }

  getFormValue(): JsonValueType {
    return this.toObjOfMappedValues(property => property.getFormValue());
  }

  getChildProperties(): GenericProperty<CHILDREN, GenericPropertyDescriptor>[] {
    return Object.keys(this.getValue()!).map(key => this.propertyFactory.create(key, this.getValue()![key]));
  }

  getDisplayValue(): number | null | string {
    const childProperties = this.getChildProperties();
    if (childProperties.length === 0) {
      return '';
    }
    return childProperties.map(p => p.getName() + ': ' + p.getDisplayValue()).reduce((a, b) => a + ', ' + b);
  }

  /**
   * @return even a property if the value is null or undefined.
   */
  getChildProperty(propertyName: string): GenericProperty<CHILDREN, GenericPropertyDescriptor> | null {
    const v = this.getValue()![propertyName];
    return this.propertyFactory.create(propertyName, v);
  }

  /**
   * {@link getChildProperties Gets all child properties} and transforms them with the given mapping function.
   *
   * _Is public because sub-classes of ObjectPropertyImpl need it, but does not need to be exported from the library._
   */
  toObjOfMappedValues<V>(propertyToValue: (property: GenericProperty<CHILDREN, GenericPropertyDescriptor>) => V): { [key: string]: V } {
    const obj: { [key: string]: any } = {};
    this.getChildProperties().forEach(property => obj[property.getName()] = propertyToValue(property));
    return obj;
  }

  protected getPropertyFactory(): PropertyFactory<CHILDREN> {
    return this.propertyFactory;
  }
}
