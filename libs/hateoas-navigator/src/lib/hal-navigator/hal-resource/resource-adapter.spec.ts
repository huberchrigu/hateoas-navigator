import {ResourceAdapter} from './resource-adapter';
import {HalResource} from './hal-resource';
import {ResourceDescriptorProvider} from '../descriptor/provider/resource-descriptor-provider';
import {ResourceLinks} from './resource-links';

describe('ResourceAdapter', () => {
  it('should get the relative link to this resource', () => {
    const testee = new ResourceAdapter('resource', {
      _links: {
        self: {href: 'http://localhost:4200/resource/1'}
      }
    } as HalResource, {} as ResourceDescriptorProvider);
    expect(testee.getSelfLink().getRelativeUri()).toEqual('/resource/1');
  });

  it('should transform an array property to a display value', () => {
    const testee = new ResourceAdapter('property', dummyResource('property', 'test', dummyResource()),
      {} as ResourceDescriptorProvider);

    expect(testee.getDisplayValue()).toEqual('property: test');
  });

  it('should combine embedded and state properties', () => {
    const testee = new ResourceAdapter('resource', dummyResource('property', 'value',
      dummyResource('nestedProperty', 'nestedValue')), {} as ResourceDescriptorProvider);
    const result = testee.getPropertiesAndEmbeddedResourcesAsProperties();

    expect(result.map(p => p.getName())).toEqual(['property', 'resource']);
    expect(result[1].getObjectProperties().map(p => p.getName())).toEqual(['nestedProperty']);
  });

  function dummyLinks(): ResourceLinks {
    return {self: {href: 'this should not be displayed'}};
  }

  function dummyResource(propertyName?: string, propertyValue?: string, embeddedResource = {} as HalResource): HalResource {
    const resource: HalResource = {
      _links: dummyLinks()
    } as HalResource;
    if (propertyName) {
      resource[propertyName] = propertyValue;
    }
    if (embeddedResource) {
      resource._embedded = {
        resource: embeddedResource
      };
    }
    return resource;
  }
});
