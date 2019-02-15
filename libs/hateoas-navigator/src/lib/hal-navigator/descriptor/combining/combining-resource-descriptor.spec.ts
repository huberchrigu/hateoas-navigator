import {CombiningResourceDescriptor} from './combining-resource-descriptor';
import {DeprecatedPropertyDescriptorMockBuilder} from './property-descriptor-mock-builder.spec';
import {DeprecatedResourceDescriptorMockBuilder} from './resource-descriptor-mock-builder.spec';
import {ActionType} from '../actions/action-type';

describe('CombiningResourceDescriptor', () => {
  it('should not contain "update" action', () => {
    const property = new DeprecatedPropertyDescriptorMockBuilder().withName('property').build();
    const resourceWithCreateAndDelete = new DeprecatedResourceDescriptorMockBuilder()
      .withEnabledActions(ActionType.CREATE_ITEM, ActionType.DELETE_ITEM).build();
    const resourceWithGets = new DeprecatedResourceDescriptorMockBuilder()
      .withEnabledActions(ActionType.GET_COLLECTION, ActionType.GET_ITEM).build();
    const testee = new CombiningResourceDescriptor([property, resourceWithCreateAndDelete, resourceWithGets]);

    expect(testee.getActions().isUpdateEnabled()).toBeFalsy();
    expect(testee.getActions().isCreateEnabled()).toBeTruthy();
    expect(testee.getActions().isDeleteEnabled()).toBeTruthy();
    expect(testee.getActions().isGetCollectionEnabled()).toBeTruthy();
    expect(testee.getActions().isGetItemEnabled()).toBeTruthy();
  });
});
