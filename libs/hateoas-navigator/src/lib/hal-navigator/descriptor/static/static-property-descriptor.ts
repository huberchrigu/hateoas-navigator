import {PropertyConfig} from '../../config';
import {FormFieldBuilder} from '../../form/form-field-builder';
import {AbstractPropertyDescriptor} from '../abstract-property-descriptor';
import {StaticResourceDescriptor} from './static-resource-descriptor';
import {DeprecatedResourceDescriptor} from 'hateoas-navigator';

export class StaticPropertyDescriptor extends AbstractPropertyDescriptor {

  constructor(name: string, protected config: PropertyConfig, protected itemConfigs: { [resourceName: string]: PropertyConfig }) {
    super(name);
  }

  getTitle(): string {
    return this.config.title;
  }

  getChildDescriptor(resourceName: string): StaticResourceDescriptor {
    return this.config.properties && this.config.properties[resourceName] ? this.toDescriptor(resourceName) : null;
  }

  getChildResourceDesc(childResource: string): DeprecatedResourceDescriptor {
    return this.config.properties && this.config.properties[childResource] ? this.toResourceDesc(childResource) : null;
  }

  getChildrenDescriptors(): Array<StaticResourceDescriptor> {
    if (!this.config.properties) {
      return [];
    }
    return Object.keys(this.config.properties).map(key => this.toDescriptor(key));
  }

  getArrayItemsDescriptor(): StaticResourceDescriptor {
    return this.config.items ? new StaticResourceDescriptor(null, this.config.items, this.itemConfigs) : null;
  }

  getAssociatedResourceName(): string {
    return this.config.associatedResourceName;
  }

  protected addFormFieldDetails(formFieldBuilder: FormFieldBuilder) {
    formFieldBuilder
      .withDateTimeType(this.config.dateTimeType)
      .withLinkedResource(this.config.associatedResourceName)
      .withOptions(this.config.enumOptions);
  }

  private toDescriptor(name: string) {
    return new StaticResourceDescriptor(name, this.config.properties[name], this.itemConfigs);
  }

  private toResourceDesc(name: string): StaticResourceDescriptor {
    return new StaticResourceDescriptor(name, this.config.properties[name], this.itemConfigs);
  }
}
