import {JsonProperty} from './json-property';
import {DisplayValueConverter} from './display-value-converter';
import {JsonType} from '../hal-resource-object';
import {PropertyDescriptor} from '../../descriptor';

export abstract class AbstractProperty<D extends PropertyDescriptor> implements JsonProperty {
  private displayValueConverter: DisplayValueConverter = new DisplayValueConverter();

  constructor(private name: string, protected descriptor?: D) {
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

  abstract getObjectProperties(): JsonProperty[];

  abstract getFormValue(): any;

  protected abstract toRawProperty(): JsonType;

  protected getSubPropertyDescriptor(fieldName: string): PropertyDescriptor {
    if (!this.descriptor) {
      return this.descriptor;
    }
    return this.descriptor.getChildDescriptor(fieldName);
  }
}
