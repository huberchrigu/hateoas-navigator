import {PropertyDescriptor} from '@hal-navigator/descriptor/property-descriptor';
import {ResourceActions} from '@hal-navigator/descriptor/actions/resource-actions';

export interface ResourceDescriptor extends PropertyDescriptor {
  getActions(): ResourceActions;

  getChildResourceDesc(childResource: string): ResourceDescriptor;
}
