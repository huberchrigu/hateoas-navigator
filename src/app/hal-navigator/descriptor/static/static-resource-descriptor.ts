import {ResourceDescriptor} from 'app/hal-navigator/descriptor/resource-descriptor';
import {ItemDescriptor} from 'app/hal-navigator/config/module-configuration';
import {Observable} from 'rxjs/Observable';
import {FormField} from 'app/hal-navigator/schema/form/form-field';
import {StaticFormField} from '@hal-navigator/descriptor/static/static-form-field';

export class StaticResourceDescriptor implements ResourceDescriptor {
  constructor(private name: string, private config: ItemDescriptor) {
  }

  getTitle(): string {
    return undefined;
  }

  getName(): string {
    return this.name;
  }

  getChild(resourceName: string): ResourceDescriptor {
    return this.config[resourceName] ? new StaticResourceDescriptor(resourceName, this.config[resourceName])
      : null;
  }

  // TODO: Currently configurations are mapped to children too
  getChildren(): Array<ResourceDescriptor> {
    return Object.keys(this.config).map(key => new StaticResourceDescriptor(key, this.config[key]));
  }

  // TODO: Associations may point to custom config too
  resolveAssociation(): Observable<ResourceDescriptor> {
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
