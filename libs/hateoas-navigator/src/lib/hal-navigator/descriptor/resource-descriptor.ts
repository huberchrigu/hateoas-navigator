import {ResourceActions} from './actions/resource-actions';
import {ObjectPropertyDescriptor} from './prop-descriptor';

export interface ResourceDescriptor extends ObjectPropertyDescriptor {
  getActions(): ResourceActions;

  /**
   * For a given resource /resource/xyz, it returns the descriptor for a link /resource/xyz/action.
   */
  getDescriptorForLink(uri: string): ResourceDescriptor;
}
