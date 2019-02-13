import {DateConverter} from './converter/date-converter';
import {PrimitiveValueType} from './value-type/json-value-type';
import {DeprecatedPropertyDescriptor} from '../descriptor';
import {AbstractProperty} from "hateoas-navigator/hal-navigator/json-property/abstract-property";

export class PrimitiveOrEmptyProperty extends AbstractProperty<PrimitiveValueType, DeprecatedPropertyDescriptor> {
  private dateConverter = new DateConverter();

  constructor(name: string, value: PrimitiveValueType, descriptor: DeprecatedPropertyDescriptor) {
    super(name, value, descriptor);
  }

  getFormValue(): any {
    const value = this.getValue();
    if (typeof value === 'string') {
      const date = this.dateConverter.parseToDate(value);
      if (date) {
        return date;
      }
    }
    return value;
  }

  getDisplayValue(): string | number {
    const v = this.getValue();
    if (typeof v === 'string') {
      const date = this.dateConverter.parseAndFormat(this.getValue());
      if (date) {
        return date;
      }
    } else if (typeof v === 'boolean') {
      return v ? 'yes' : 'no';
    }
    return v;
  }
}
