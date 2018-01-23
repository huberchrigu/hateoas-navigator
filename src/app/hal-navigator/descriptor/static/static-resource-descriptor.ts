import {StaticPropertyDescriptor} from '@hal-navigator/descriptor/static/static-property-descriptor';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {ResourceActions} from '@hal-navigator/descriptor/actions/resource-actions';

export class StaticResourceDescriptor extends StaticPropertyDescriptor implements ResourceDescriptor {
  getActions(): ResourceActions {
    return undefined;
  }

  getChildResourceDesc(childResource: string): ResourceDescriptor {
    return this.config.properties && this.config.properties[childResource] ? this.toResourceDesc(childResource) : null;
  }

  private toResourceDesc(name: string): StaticResourceDescriptor {
    return new StaticResourceDescriptor(name, this.config.properties[name], this.itemConfigs);
  }

}
