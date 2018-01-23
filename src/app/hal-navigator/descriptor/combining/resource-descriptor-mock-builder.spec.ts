import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {ActionType} from '@hal-navigator/descriptor/actions/action-type';
import {ResourceActions} from '@hal-navigator/descriptor/actions/resource-actions';
import {ResourceAction} from '@hal-navigator/descriptor/actions/resource-action';
import {PropertyDescriptorMockBuilder} from '@hal-navigator/descriptor/combining/property-descriptor-mock-builder.spec';

export class ResourceDescriptorMockBuilder extends PropertyDescriptorMockBuilder<ResourceDescriptor> {
  withEnabledActions(...actions: Array<ActionType>) {
    this.returnValues.getActions = new ResourceActions(actions.map(a => new ResourceAction(a, true)));
    return this;
  }
}
