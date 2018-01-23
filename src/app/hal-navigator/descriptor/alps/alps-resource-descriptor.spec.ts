import {AlpsResourceDescriptor} from '@hal-navigator/descriptor/alps/alps-resource-descriptor';
import {AlpsDescriptor} from '@hal-navigator/alps-document/alps-descriptor';

describe('AlpsResourceDescriptor', () => {
  it('should read get actions', () => {
    const representation = {
      id: 'resource-representation'
    } as AlpsDescriptor;
    const getItem = {
      id: 'get-resource'
    } as AlpsDescriptor;
    const getCollection = {
      id: 'get-resources'
    } as AlpsDescriptor;
    const testee = new AlpsResourceDescriptor(representation, [representation, getItem, getCollection]);

    expect(testee.getActions().getAll().length).toBe(2);
    expect(testee.getActions().isGetItemEnabled()).toBeTruthy();
    expect(testee.getActions().isGetCollectionEnabled()).toBeTruthy();
  });
});
