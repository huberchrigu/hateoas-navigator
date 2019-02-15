import {StaticPropertyDescriptor} from './static-property-descriptor';
import {ResourceActions} from '../actions/resource-actions';
import {DeprecatedResourceDescriptor} from '../deprecated-resource-descriptor';

export class StaticResourceDescriptor extends StaticPropertyDescriptor implements DeprecatedResourceDescriptor {
  getActions(): ResourceActions {
    return undefined;
  }

  getDescriptorForLink(uri: string): DeprecatedResourceDescriptor {
    const indexOfLastSlash = uri.lastIndexOf('/');
    const actionName = indexOfLastSlash > -1 ? uri.substring(indexOfLastSlash + 1) : uri;
    if (!this.config.actionLinks)
      return null;
    const c = this.config.actionLinks[actionName];
    return c ? new StaticResourceDescriptor(actionName, c, this.itemConfigs) : null;
  }
}
