import {GenericArrayValueType, JsonValueType} from '../value-type/json-value-type';
import {AbstractProperty} from '../abstract-property';
import {PropertyFactory} from '../factory/property-factory';
import {ArrayPropertyDescriptor, PropDescriptor} from '../../descriptor/prop-descriptor';
import {GenericProperty} from '../generic-property';
import {ArrayProperty} from './array-property';

export class JsonArrayPropertyImpl<CHILDREN extends JsonValueType>
  extends AbstractProperty<GenericArrayValueType<CHILDREN>, ArrayPropertyDescriptor>
  implements ArrayProperty<CHILDREN> {
  constructor(
    name: string,
    value: GenericArrayValueType<CHILDREN>,
    descriptor: ArrayPropertyDescriptor,
    private propertyFactory: PropertyFactory<CHILDREN>
  ) {
    super(name, value, descriptor);
  }

  /**
   * If this property was flagged to be a URI (i.e. it is an embedded resource object), extract the URI.
   * Transform other values otherwise.
   */
  getFormValue(): any[] {
    return this.getArrayItems().map(item => item.getFormValue());
  }

  getArrayItems(): GenericProperty<CHILDREN, PropDescriptor>[] {
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
