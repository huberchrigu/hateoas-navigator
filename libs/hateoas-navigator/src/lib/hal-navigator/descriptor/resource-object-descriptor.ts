import {ResourceActions} from './actions/resource-actions';
import {ObjectDescriptor} from './generic-property-descriptor';

export interface ResourceObjectDescriptor extends ObjectDescriptor {
  getActions(): ResourceActions;

  /**
   * For a given resource /resource/xyz, it returns the descriptor for a link /resource/xyz/action.
   */
  getDescriptorForLink(uri: string): ResourceObjectDescriptor | undefined;
}
