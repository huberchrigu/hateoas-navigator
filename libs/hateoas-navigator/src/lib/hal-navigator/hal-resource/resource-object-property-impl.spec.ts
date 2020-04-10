import {ResourceObjectPropertyImpl} from './resource-object-property-impl';
import {HalResourceObject, HalValueType} from './value-type/hal-value-type';
import {ResourceLinks} from './value-type/resource-links';
import {LinkFactory} from '../link-object/link-factory';
import {HalPropertyFactory} from './factory/hal-property-factory';
import {PropertyFactory} from '../json-property/factory/property-factory';
import SpyObj = jasmine.SpyObj;
import {ResourceLink} from '../link-object/resource-link';
import {HalResourceFactory} from './factory/hal-resource-factory';
import {PrimitiveProperty} from '../json-property/generic-property';
import {ResourceObjectProperty} from './resource-object-property';

describe('ResourceObjectPropertyImpl', () => {
  let linkFactory: SpyObj<LinkFactory>;
  let resourceFactory: SpyObj<HalResourceFactory>;
  let propertyFactory: SpyObj<HalPropertyFactory>;

  beforeEach(() => {
    linkFactory = jasmine.createSpyObj<LinkFactory>(['getLink']);
    resourceFactory = jasmine.createSpyObj<HalResourceFactory>(['create']);
    propertyFactory = jasmine.createSpyObj<HalPropertyFactory>(['create', 'createEmbedded']);
  });

  it('should get the relative link to this resource', () => {
    const links = {
      self: {href: 'http://localhost:4200/resource/1'}
    };
    const testee = createTestee('resource', {
      _links: links
    } as HalResourceObject);
    const link = {} as ResourceLink;
    linkFactory.getLink.withArgs('self').and.returnValue(link);
    expect(testee.getSelfLink()).toBe(link);
    expect(linkFactory.getLink).toHaveBeenCalledWith('self');
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
  });

  it('should get embedded object without associations', () => {
    const array = [{
      item: 1
    }];
    const json = {
      _embedded: {
        array
      }
    };

    const propertyFactoryWithDesc = jasmine.createSpyObj<PropertyFactory<HalValueType>>('propertyFactory', ['createEmbedded']);

    const testee = new ResourceObjectPropertyImpl('testee', json, propertyFactoryWithDesc, resourceFactory, linkFactory);
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
      propertyFactory.create.withArgs(propertyName, propertyValue).and.returnValue({
        getDisplayValue: () => propertyValue,
        getName: () => propertyName
      } as PrimitiveProperty);
    }
    if (embeddedResource) {
      resource._embedded = {
        resource: embeddedResource
      };
      propertyFactory.createEmbedded.withArgs('resource', embeddedResource).and.returnValue({
        getName: () => 'resource'
      } as ResourceObjectProperty);
    }
    return resource;
  }

  function createTestee(name: string, halResourceObject: HalResourceObject) {
    return new ResourceObjectPropertyImpl(name, halResourceObject, propertyFactory, resourceFactory, linkFactory);
  }
});
