import {CombiningResourceDescriptor} from './combining-resource-descriptor';
import {PropertyDescriptorMockBuilder} from './property-descriptor-mock-builder.spec';
import {ResourceDescriptorMockBuilder} from './resource-descriptor-mock-builder.spec';
import {ActionType} from '../actions/action-type';

describe('CombiningResourceDescriptor', () => {
  it('should not contain "update" action', () => {
    const property = new PropertyDescriptorMockBuilder().withName('property').build();
    const resourceWithCreateAndDelete = new ResourceDescriptorMockBuilder()
      .withEnabledActions(ActionType.CREATE_ITEM, ActionType.DELETE_ITEM).build();
    const resourceWithGets = new ResourceDescriptorMockBuilder()
      .withEnabledActions(ActionType.GET_COLLECTION, ActionType.GET_ITEM).build();
    const testee = new CombiningResourceDescriptor([property, resourceWithCreateAndDelete, resourceWithGets]);

    expect(testee.getActions().isUpdateEnabled()).toBeFalsy();
    expect(testee.getActions().isCreateEnabled()).toBeTruthy();
    expect(testee.getActions().isDeleteEnabled()).toBeTruthy();
    expect(testee.getActions().isGetCollectionEnabled()).toBeTruthy();
    expect(testee.getActions().isGetItemEnabled()).toBeTruthy();
  });
});
