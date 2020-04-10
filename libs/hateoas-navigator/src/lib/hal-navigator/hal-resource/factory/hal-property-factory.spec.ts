import {HalPropertyFactory} from './hal-property-factory';
import {HalResourceFactory} from './hal-resource-factory';
import {ResourceObjectDescriptor} from '../../descriptor/resource-object-descriptor';
import {
  ArrayDescriptorMockBuilder, AssociationDescriptorMockBuilder, PropertyDescriptorMockBuilder,
  ResourceDescriptorMockBuilder
} from '../../descriptor/combining/property-descriptor-mock-builder.spec';
import {ResourceObjectProperty} from '../resource-object-property';
import {JsonArrayProperty} from '../../json-property/array/array-property';

describe('HalPropertyFactory', () => {
  let resourceFactory: HalResourceFactory;
  let resourceDesc: ResourceObjectDescriptor;

  beforeAll(() => {
    resourceFactory = jasmine.createSpyObj('resourceFactory', ['create']);
    const itemPropertyDescriptor = new PropertyDescriptorMockBuilder().withName('item').build();
    const arrayDescriptor = new ArrayDescriptorMockBuilder()
      .withArrayItemsDescriptor(new AssociationDescriptorMockBuilder()
        .withAssociatedResource(new ResourceDescriptorMockBuilder()
          .withChildrenDescriptors([itemPropertyDescriptor])
          .withChildDescriptor(itemPropertyDescriptor)
          .build())
        .build())
      .withName('array')
      .build();
    resourceDesc = new ResourceDescriptorMockBuilder()
      .withChildDescriptor(arrayDescriptor)
      .withChildrenDescriptors([arrayDescriptor])
      .build();
  });

  it('should resolve associations', () => {
    const testee = new HalPropertyFactory(resourceFactory, resourceDesc);
    const result = testee.createEmbedded('array', [{
      item: 1
    }]) as JsonArrayProperty;

    const items = result.getArrayItems();
    expect(items.length).toBe(1);
    const item = items[0] as ResourceObjectProperty;
    expect(item.getChildProperties().length).toBe(1);
    expect(item.getChildProperties()[0].getDescriptor().getName()).toEqual('item');
  });
});
