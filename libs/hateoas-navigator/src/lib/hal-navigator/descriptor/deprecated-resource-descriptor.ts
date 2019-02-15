import {ResourceActions} from './actions/resource-actions';
import {DeprecatedPropertyDescriptor, ObjectPropertyDescriptor} from './deprecated-property-descriptor';

export interface DeprecatedResourceDescriptor extends DeprecatedPropertyDescriptor {
  getActions(): ResourceActions;

  /**
   * For a given resource /resource/xyz, it returns the descriptor for a link /resource/xyz/action.
   */
  getDescriptorForLink(uri: string): DeprecatedResourceDescriptor;
}

export interface ResourceDescriptor extends ObjectPropertyDescriptor {
  getActions(): ResourceActions;

  /**
   * For a given resource /resource/xyz, it returns the descriptor for a link /resource/xyz/action.
   */
  getDescriptorForLink(uri: string): ResourceDescriptor;
}
