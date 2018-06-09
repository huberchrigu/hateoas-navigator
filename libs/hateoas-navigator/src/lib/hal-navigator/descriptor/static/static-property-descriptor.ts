import {PropertyConfig} from '../../config';
import {FormFieldBuilder} from '../../form/form-field-builder';
import {AbstractPropertyDescriptor} from '../abstract-property-descriptor';


export class StaticPropertyDescriptor extends AbstractPropertyDescriptor {

  constructor(name: string, protected config: PropertyConfig, protected itemConfigs: { [resourceName: string]: PropertyConfig }) {
    super(name);
  }

  getTitle(): string {
    return this.config.title;
  }

  getChildDescriptor(resourceName: string): StaticPropertyDescriptor {
    return this.config.properties && this.config.properties[resourceName] ? this.toDescriptor(resourceName) : null;
  }

  getChildrenDescriptors(): Array<StaticPropertyDescriptor> {
    if (!this.config.properties) {
      return [];
    }
    return Object.keys(this.config.properties).map(key => this.toDescriptor(key));
  }

  getArrayItemsDescriptor(): StaticPropertyDescriptor {
    return this.config.items ? new StaticPropertyDescriptor(null, this.config.items, this.itemConfigs) : null;
  }

  getAssociatedResourceName(): string {
    return this.config.associatedResourceName;
  }

  protected addFormFieldDetails(formFieldBuilder: FormFieldBuilder) {
    formFieldBuilder
      .withDateTimeType(this.config.dateTimeType)
      .withLinkedResource(this.config.associatedResourceName);
  }

  private toDescriptor(name: string) {
    return new StaticPropertyDescriptor(name, this.config.properties[name], this.itemConfigs);
  }
}
