import {ResourceAdapter} from './resource-adapter';
import {HalResourceObject, HalValueType} from './value-type/hal-value-type';
import {ResourceLinks} from './value-type/resource-links';
import {LinkFactory} from '../link-object/link-factory';
import {HalPropertyFactory} from './factory/hal-property-factory';
import {ResourceAdapterFactoryService} from './resource-adapter-factory.service';
import {ResourceDescriptorProvider} from '../descriptor/provider/resource-descriptor-provider';
import {PropertyFactory} from '../json-property/factory/property-factory';

describe('ResourceAdapter', () => {
  let linkFactory: LinkFactory;
  let resourceDescriptorProvider: ResourceDescriptorProvider;
  let resourceFactory: ResourceAdapterFactoryService;
  let propertyFactory: HalPropertyFactory;

  beforeAll(() => {
    // TODO: Should all be mocked, and tests moved to according factory
    linkFactory = {} as LinkFactory;
    resourceDescriptorProvider = {} as ResourceDescriptorProvider;
    resourceFactory = new ResourceAdapterFactoryService(resourceDescriptorProvider);
    propertyFactory = new HalPropertyFactory(resourceFactory);
  });

  it('should get the relative link to this resource', () => {
    const links = {
      self: {href: 'http://localhost:4200/resource/1'}
    };
    const testee = createTestee('resource', {
      _links: links
    } as HalResourceObject, new LinkFactory(links, resourceDescriptorProvider));
    expect(testee.getSelfLink().toRelativeLink().getUri).toEqual('/resource/1');
  });

  it('should transform an array property to a display value', () => {
    const testee = createTestee('property', dummyResource('property', 'test', dummyResource()));

    expect(testee.getDisplayValue()).toEqual('property: test');
  });

  it('should combine embedded and state properties', () => {

    const testee = createTestee('resource', dummyResource('property', 'value',
      dummyResource('nestedProperty', 'nestedValue')));
    const result = testee.getChildProperties();

    expect(result.map(p => p.getName())).toEqual(['property', 'resource']);
    expect((result[1] as ResourceAdapter).getChildProperties().map(p => p.getName())).toEqual(['nestedProperty']);
  });

  it('should get embedded object without associations', () => {
    const array = [{
      'item': 1
    }];
    const json = {
      '_embedded': {
        'array': array
      }
    };

    const propertyFactoryWithDesc = jasmine.createSpyObj<PropertyFactory<HalValueType>>('propertyFactory', ['createEmbedded']);

    const testee = new ResourceAdapter('testee', json, propertyFactoryWithDesc, resourceFactory, linkFactory);
    expect(testee.getChildProperties().length).toBe(1);

    expect(propertyFactoryWithDesc.createEmbedded).toHaveBeenCalledWith('array', array);
  });

  function dummyLinks(): ResourceLinks {
    return {self: {href: 'this should not be displayed'}};
  }

  function dummyResource(propertyName?: string, propertyValue?: string, embeddedResource?: any): HalResourceObject {
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

  function createTestee(name: string, halResourceObject: HalResourceObject, lf = linkFactory) {
    return new ResourceAdapter(name, halResourceObject, propertyFactory, resourceFactory, lf);
  }
});
