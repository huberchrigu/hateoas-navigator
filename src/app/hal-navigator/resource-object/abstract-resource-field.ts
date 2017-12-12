import {ResourceField} from '@hal-navigator/resource-object/resource-field';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {DisplayValueConverter} from '@hal-navigator/resource-object/properties/display-value-converter';
import {JsonType} from '@hal-navigator/resource-object/resource-object';

export abstract class AbstractResourceField implements ResourceField {
  private displayValueConverter: DisplayValueConverter = new DisplayValueConverter();

  protected descriptor: ResourceDescriptor;

  getDisplayValue(): string | number {
    return this.displayValueConverter.transform(this.toRawProperty());
  }

  getDescriptor(): ResourceDescriptor {
    if (!this.descriptor) {
      throw new Error('The resource descriptor must be resolved before it can be used');
    }
    return this.descriptor;
  }

  abstract isUriType(): boolean;

  abstract getFormValue(): any;

  protected abstract toRawProperty(): JsonType;

  protected getSubDescriptor(fieldName: string) {
    return this.descriptor ? this.descriptor.getChild(fieldName) : null;
  }
}
