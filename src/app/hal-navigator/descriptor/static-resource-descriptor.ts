import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {ItemDescriptor} from '@hal-navigator/config/module-configuration';

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
}
