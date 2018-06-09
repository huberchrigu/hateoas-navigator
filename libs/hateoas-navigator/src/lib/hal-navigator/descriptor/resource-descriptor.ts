import {ResourceActions} from './actions/resource-actions';
import {PropertyDescriptor} from './property-descriptor';

export interface ResourceDescriptor extends PropertyDescriptor {
  getActions(): ResourceActions;

  getChildResourceDesc(childResource: string): ResourceDescriptor;
}
