import {ResourceActions} from './actions/resource-actions';
import {PropertyDescriptor} from './property-descriptor';

export interface ResourceDescriptor extends PropertyDescriptor {
  getActions(): ResourceActions;

  /**
   * For a given resource /resource/xyz, it returns the descriptor for a link /resource/xyz/action.
   */
  getDescriptorForLink(uri: string): ResourceDescriptor;

  getChildResourceDesc(childResource: string): ResourceDescriptor;
}
