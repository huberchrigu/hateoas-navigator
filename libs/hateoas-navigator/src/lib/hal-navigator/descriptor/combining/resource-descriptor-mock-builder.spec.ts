import {DeprecatedResourceDescriptor, ResourceDescriptor} from '../deprecated-resource-descriptor';
import {ActionType} from '../actions/action-type';
import {ResourceActions} from '../actions/resource-actions';
import {ResourceAction} from '../actions/resource-action';
import {DeprecatedPropertyDescriptorMockBuilder, PropertyDescriptorMockBuilder} from './property-descriptor-mock-builder.spec';

export class DeprecatedResourceDescriptorMockBuilder extends DeprecatedPropertyDescriptorMockBuilder<DeprecatedResourceDescriptor> {
  withEnabledActions(...actions: Array<ActionType>) {
    this.methodNames.getActions = new ResourceActions(actions.map(a => new ResourceAction(a, true)));
    return this;
  }
}

export class ResourceDescriptorMockBuilder extends PropertyDescriptorMockBuilder<ResourceDescriptor> {
  withEnabledActions(...actions: Array<ActionType>) {
    this.methodNames.getActions = new ResourceActions(actions.map(a => new ResourceAction(a, true)));
    return this;
  }
}
