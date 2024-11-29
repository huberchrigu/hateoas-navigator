import {AlpsDescriptor} from '../../alps-document/alps-descriptor';
import {AlpsDescriptorMapper} from './alps-descriptor-mapper';

describe('AlpsDescriptorMapper', () => {
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
    const testee = new AlpsDescriptorMapper(representation, [representation, getItem, getCollection]);
    const actions = testee.toBuilder().actions!;

    expect(actions.getAll().length).toBe(2);
    expect(actions.isGetItemEnabled()).toBeTruthy();
    expect(actions.isGetCollectionEnabled()).toBeTruthy();
  });
});
