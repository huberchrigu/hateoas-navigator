import {CollectionAdapter} from '@hal-navigator/collection/collection-adapter';
import {ResourceAdapter} from '@hal-navigator/hal-resource/resource-adapter';

describe('CollectionAdapter', () => {
  it('should return no properties', () => {
    const resourceObject = jasmine.createSpyObj<ResourceAdapter>('resourceObject', ['getEmbeddedResources', 'getName']);
    resourceObject.getEmbeddedResources.and.returnValue([]);

    const testee = new CollectionAdapter(resourceObject);

    expect(testee.getPropertyNames().length).toBe(0);
  });
});
