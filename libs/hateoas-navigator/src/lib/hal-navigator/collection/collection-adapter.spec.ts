import {JsonResourceObjectImpl} from '../hal-resource/json-resource-object-impl';
import {CollectionAdapter} from './collection-adapter';
import {HalResourceFactory} from '../hal-resource/factory/hal-resource-factory';

describe('CollectionAdapter', () => {
  it('should return no properties', () => {
    const resourceObject = jasmine.createSpyObj<JsonResourceObjectImpl>('resourceObject', ['getEmbeddedResources', 'getName']);
    resourceObject.getEmbeddedResources.and.returnValue([]);

    const testee = new CollectionAdapter({} as HalResourceFactory, resourceObject);

    expect(testee.getPropertyNames().length).toBe(0);
  });
});
