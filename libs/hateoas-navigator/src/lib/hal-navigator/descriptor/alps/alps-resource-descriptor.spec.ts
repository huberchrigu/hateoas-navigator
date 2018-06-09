import {AlpsDescriptor} from '../../alps-document/alps-descriptor';
import {AlpsResourceDescriptor} from './alps-resource-descriptor';

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
