import {ResourceAdapter} from './resource-adapter';
import {HalResourceObject, HalValueType} from './value-type/hal-value-type';
import {ResourceLinks} from './value-type/resource-links';
import {PropertyFactory} from '../json-property/factory/property-factory';
import {HalResourceFactory} from './factory/hal-resource-factory';
import {LinkFactory} from '../link-object/link-factory';

describe('ResourceAdapter', () => {
  const propertyFactory = {} as PropertyFactory<HalValueType>;
  const resourceFactory = {} as HalResourceFactory;
  const linkFactory = {} as LinkFactory;


  it('should get the relative link to this resource', () => {
    const testee = createTestee('resource', {
      _links: {
        self: {href: 'http://localhost:4200/resource/1'}
      }
    } as HalResourceObject);
    expect(testee.getSelfLink().getRelativeUri()).toEqual('/resource/1');
  });

  it('should transform an array property to a display value', () => {
    const testee = createTestee('property', dummyResource('property', 'test', dummyResource()));

    expect(testee.getDisplayValue()).toEqual('property: test');
  });

  it('should combine embedded and state properties', () => {

    const testee = createTestee('resource', dummyResource('property', 'value',
      dummyResource('nestedProperty', 'nestedValue')));
    const result = testee.getPropertiesAndEmbeddedResourcesAsProperties();

    expect(result.map(p => p.getName())).toEqual(['property', 'resource']);
    expect((result[1] as ResourceAdapter).getChildProperties().map(p => p.getName())).toEqual(['nestedProperty']);
  });

  function dummyLinks(): ResourceLinks {
    return {self: {href: 'this should not be displayed'}};
  }

  function dummyResource(propertyName?: string, propertyValue?: string, embeddedResource = undefined): HalResourceObject {
    const resource: HalResourceObject = {
      _links: dummyLinks()
    } as HalResourceObject;
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

  function createTestee(name: string, halResourceObject: HalResourceObject) {
    return new ResourceAdapter(name, halResourceObject, propertyFactory, resourceFactory, linkFactory);
  }
});
