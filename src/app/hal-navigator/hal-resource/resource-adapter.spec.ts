import {ResourceAdapter} from 'app/hal-navigator/hal-resource/resource-adapter';
import {HalResource} from '@hal-navigator/hal-resource/hal-resource';
import {ResourceLinks} from 'app/hal-navigator/hal-resource/resource-links';
import {ResourceDescriptorResolver} from 'app/hal-navigator/descriptor/resolver/resource-descriptor-resolver';

describe('ResourceAdapter', () => {
  it('should get the relative link to this resource', () => {
    const testee = new ResourceAdapter('resource', {
      _links: {
        self: {href: 'http://localhost:4200/resource/1'}
      }
    } as HalResource, {} as ResourceDescriptorResolver);
    expect(testee.getSelfLink().getRelativeUri()).toEqual('/resource/1');
  });

  it('should transform an array property to a display value', () => {
    const testee = new ResourceAdapter('property', dummyResource('property', 'test', true),
      {} as ResourceDescriptorResolver);

    expect(testee.getDisplayValue()).toEqual('property: test');
  });

  function dummyLinks(): ResourceLinks {
    return {self: {href: 'this should not be displayed'}};
  }

  function dummyResource(propertyName?: string, propertyValue?: string, embeddedResource = false): HalResource {
    const resource: HalResource = {
      _links: dummyLinks()
    } as HalResource;
    if (propertyName) {
      resource[propertyName] = propertyValue;
    }
    if (embeddedResource) {
      resource._embedded = {
        resource: dummyResource()
      };
    }
    return resource;
  }
});
