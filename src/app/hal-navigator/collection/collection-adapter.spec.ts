import {CollectionAdapter} from '@hal-navigator/collection/collection-adapter';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';

describe('CollectionAdapter', () => {
  it('should return no properties', () => {
    const resourceObject = jasmine.createSpyObj<ResourceObjectAdapter>('resourceObject', ['getEmbeddedResources', 'getResourceName']);
    resourceObject.getEmbeddedResources.and.returnValue([]);

    const testee = new CollectionAdapter(resourceObject);

    expect(testee.getPropertyNames().length).toBe(0);
  });
});
