import {JsonProperty} from 'app/hal-navigator/hal-resource/property/json-property';
import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {DisplayValueConverter} from 'app/hal-navigator/hal-resource/property/display-value-converter';
import {JsonType} from 'app/hal-navigator/hal-resource/hal-resource';
import {ResourceProperty} from '@hal-navigator/hal-resource/property/resource-property';

export abstract class AbstractProperty<D extends PropertyDescriptor> implements JsonProperty {
  private displayValueConverter: DisplayValueConverter = new DisplayValueConverter();

  constructor(private name: string, protected descriptor: D = undefined) {
  }

  getName() {
    return this.name;
  }

  getDisplayValue(): string | number {
    return this.displayValueConverter.transform(this.toRawProperty());
  }

  getDescriptor(): D {
    if (!this.descriptor) {
      throw new Error('The resource descriptor must be resolved before it can be used');
    }
    return this.descriptor;
  }

  getObjectProperties(): ResourceProperty[] {
    const value = this.toRawProperty();
    if (typeof value !== 'object') {
      throw new Error(JSON.stringify(value) + ' is not an object!');
    }
    return Object.keys(value).map(key => new ResourceProperty(key, value[key], this.getSubPropertyDescriptor(key)));
  }

  abstract getFormValue(): any;

  protected abstract toRawProperty(): JsonType;

  protected getSubPropertyDescriptor(fieldName: string) {
    if (!this.descriptor) {
      return this.descriptor;
    }
    return this.descriptor.getChildDescriptor(fieldName);
  }
}
