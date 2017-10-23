import {DisplayValueConverter} from '@hal-navigator/resource-object/properties/display-value-converter';
import {ValueConverter} from '@hal-navigator/resource-object/properties/value-converter';
import {DateConverter} from '@hal-navigator/resource-object/properties/date-converter';

export class ResourceProperty {
  private dateConverter = new DateConverter();
  private displayValueConverter = new DisplayValueConverter();
  private formValueConverter: ValueConverter<Date, Array<any>, Object> = new ValueConverter(
    (value: string) => this.dateConverter.parseToDate(value)
  );

  constructor(private name: string, private value: any) {

  }

  getName(): string {
    return this.name;
  }

  getValue(): string | number | Object | Array<any> {
    return this.value;
  }

  getDisplayValue(): string | number {
    return this.displayValueConverter.transform(this.value);
  }

  getFormValue() {
    return this.formValueConverter.transform(this.value);
  }

  getArrayValue(): Array<any> {
    if (this.isArray()) {
      return this.value;
    } else {
      throw new Error(this.value + ' is not an array');
    }
  }

  private isArray(): boolean {
    return Array.isArray((this.value));
  }
}
