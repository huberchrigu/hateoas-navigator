import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';
import {ResourceObject} from '@hal-navigator/resource-object/resource-object';
import {ResourceLinks} from '@hal-navigator/resource-object/resource-links';
import {ResourceDescriptorResolver} from '@hal-navigator/descriptor/resource-descriptor-resolver';

describe('ResourceObjectAdapter', () => {
  it('should get the relative link to this resource', () => {
    const testee = new ResourceObjectAdapter({
      _links: {
        self: {href: 'http://localhost:4200/resource/1'}
      }
    } as ResourceObject, {} as ResourceDescriptorResolver);
    expect(testee.getSelfLink().getRelativeUri()).toEqual('/resource/1');
  });

  it('should transform an array property to a display value', () => {
    const testee = new ResourceObjectAdapter(dummyResource('property', 'test', true),
      {} as ResourceDescriptorResolver);

    expect(testee.getDisplayValue()).toEqual('property: test');
  });

  function dummyLinks(): ResourceLinks {
    return {self: {href: 'this should not be displayed'}};
  }

  function dummyResource(propertyName?: string, propertyValue?: string, embeddedResource = false): ResourceObject {
    const resource: ResourceObject = {
      _links: dummyLinks()
    } as ResourceObject;
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
