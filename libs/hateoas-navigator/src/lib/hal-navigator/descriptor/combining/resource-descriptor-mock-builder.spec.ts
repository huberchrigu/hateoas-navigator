import {ResourceDescriptor} from '../resource-descriptor';
import {ActionType} from '../actions/action-type';
import {ResourceActions} from '../actions/resource-actions';
import {ResourceAction} from '../actions/resource-action';
import {PropertyDescriptorMockBuilder} from './property-descriptor-mock-builder.spec';

export class ResourceDescriptorMockBuilder extends PropertyDescriptorMockBuilder<ResourceDescriptor> {
  withEnabledActions(...actions: Array<ActionType>) {
    this.returnValues.getActions = new ResourceActions(actions.map(a => new ResourceAction(a, true)));
    return this;
  }
}
