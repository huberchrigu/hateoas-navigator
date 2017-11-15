import {DisplayValueConverter} from '@hal-navigator/resource-object/properties/display-value-converter';
import {ValueConverter} from '@hal-navigator/resource-object/properties/value-converter';
import {DateConverter} from '@hal-navigator/resource-object/properties/date-converter';
import {ResourceObject} from '@hal-navigator/resource-object/resource-object';
import {ResourceLink} from '@hal-navigator/link-object/resource-link';

export class ResourceProperty {
  private dateConverter = new DateConverter();
  private displayValueConverter = new DisplayValueConverter();
  private formValueConverter: ValueConverter<Date, Array<any>, Object> = new ValueConverter(
    (value: string) => this.dateConverter.parseToDate(value)
  ) as ValueConverter<Date, Array<any>, Object>;

  constructor(private name: string, private value: any, private uriType = false) {

  }

  getName(): string {
    return this.name;
  }

  getValue(): string | number | Object | Array<any> {
    return this.value;
  }

  /**
   * The this property is an embedded object, remove metadata.
   * <p>
   * <b>Warning</b>: This behavior was already implemented for the <code>ResourceObjectAdapter</code>.
   * Therefore the architecture is not sufficient yet. A resource object should never be also a property!
   */
  getDisplayValue(): string | number {
    if (this.uriType) {
      const properties = {};
      Object.keys(this.value)
        .filter(propertyName => propertyName !== '_links' && propertyName !== '_embedded')
        .forEach(propertyName => properties[propertyName] = this.value[propertyName]);
      return this.displayValueConverter.transform(properties);
    }
    return this.displayValueConverter.transform(this.value);
  }

  /**
   * If this property was flagged to be a URI (i.e. it is an embedded resource object), extract the URI.
   * Transform other values otherwise.
   */
  getFormValue() {
    if (this.uriType) {
      const resourceObject = this.value as ResourceObject;
      return new ResourceLink('self', resourceObject._links.self).getFullUriWithoutTemplatedPart();
    }
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
