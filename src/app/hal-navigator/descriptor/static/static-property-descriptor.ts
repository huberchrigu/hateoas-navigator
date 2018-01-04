import {PropertyConfig} from 'app/hal-navigator/config/module-configuration';
import {FormField} from 'app/hal-navigator/form/form-field';
import {StaticFormField} from '@hal-navigator/descriptor/static/static-form-field';
import {PropertyDescriptor} from '@hal-navigator/descriptor/property-descriptor';

export class StaticPropertyDescriptor implements PropertyDescriptor {

  constructor(private name: string, private config: PropertyConfig, private itemConfigs: { [resourceName: string]: PropertyConfig }) {
  }

  getTitle(): string {
    return this.config.title;
  }

  getName(): string {
    return this.name;
  }

  getChild(resourceName: string): StaticPropertyDescriptor {
    return this.config.properties && this.config.properties[resourceName] ? this.resolveChild(resourceName) : null;
  }

  getChildren(): Array<StaticPropertyDescriptor> {
    if (!this.config.properties) {
      return [];
    }
    return Object.keys(this.config.properties).map(key => this.resolveChild(key));
  }

  getAssociatedResourceName(): string {
    return undefined;
  }

  getPropertyConfig() {
    return this.config;
  }

  toFormField(): FormField {
    return new StaticFormField(this);
  }

  private resolveChild(name: string) {
    return new StaticPropertyDescriptor(name, this.config.properties[name], this.itemConfigs);
  }
}
