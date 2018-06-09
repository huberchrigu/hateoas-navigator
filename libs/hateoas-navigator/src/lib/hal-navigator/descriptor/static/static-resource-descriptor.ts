import {StaticPropertyDescriptor} from './static-property-descriptor';
import {ResourceActions} from '../actions/resource-actions';
import {ResourceDescriptor} from '../resource-descriptor';

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
