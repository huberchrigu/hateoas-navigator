import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {ItemDescriptor} from 'app/hal-navigator/config/module-configuration';
import {Observable} from 'rxjs/Observable';
import {FormField} from 'app/hal-navigator/form/form-field';
import {StaticFormField} from '@hal-navigator/descriptor/static/static-form-field';

export class StaticPropertyDescriptor implements PropertyDescriptor {
  constructor(private name: string, private config: ItemDescriptor) {
    if (!config) {
      throw new Error('A descriptor needs a configuration');
    }
  }

  getTitle(): string {
    return undefined;
  }

  getName(): string {
    return this.name;
  }

  getChild(resourceName: string): PropertyDescriptor {
    return this.config[resourceName] ? new StaticPropertyDescriptor(resourceName, this.config[resourceName])
      : null;
  }

  // TODO: Currently configurations are mapped to children too
  getChildren(): Array<PropertyDescriptor> {
    return Object.keys(this.config).map(key => new StaticPropertyDescriptor(key, this.config[key]));
  }

  // TODO: Associations may point to custom config too
  resolveAssociation(): Observable<PropertyDescriptor> {
    return undefined;
  }

  getAssociatedResource() {
    return undefined;
  }

  getItemDescriptor() {
    return this.config;
  }

  toFormField(): FormField {
    return new StaticFormField(this);
  }
}
