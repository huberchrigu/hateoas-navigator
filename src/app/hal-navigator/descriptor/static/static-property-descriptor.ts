import {AbstractPropertyDescriptor} from '@hal-navigator/descriptor/abstract-property-descriptor';
import {PropertyConfig} from '@hal-navigator/config/module-configuration';
import {FormFieldBuilder} from '@hal-navigator/form/form-field-builder';

export class StaticPropertyDescriptor extends AbstractPropertyDescriptor {

  constructor(name: string, private config: PropertyConfig, private itemConfigs: { [resourceName: string]: PropertyConfig }) {
    super(name);
  }

  getTitle(): string {
    return this.config.title;
  }

  getChildDescriptor(resourceName: string): StaticPropertyDescriptor {
    return this.config.properties && this.config.properties[resourceName] ? this.resolveChild(resourceName) : null;
  }

  getChildrenDescriptors(): Array<StaticPropertyDescriptor> {
    if (!this.config.properties) {
      return [];
    }
    return Object.keys(this.config.properties).map(key => this.resolveChild(key));
  }

  getArrayItemsDescriptor(): StaticPropertyDescriptor {
    return this.config.items ? new StaticPropertyDescriptor(null, this.config.items, this.itemConfigs) : null;
  }

  getAssociatedResourceName(): string {
    return undefined;
  }

  getPropertyConfig() {
    return this.config;
  }

  protected addFormFieldDetails(formFieldBuilder: FormFieldBuilder) {
    const items = this.getPropertyConfig().items;
    formFieldBuilder
      .withDateTimeType(this.config.dateTimeType);
  }

  private resolveChild(name: string) {
    return new StaticPropertyDescriptor(name, this.config.properties[name], this.itemConfigs);
  }
}
