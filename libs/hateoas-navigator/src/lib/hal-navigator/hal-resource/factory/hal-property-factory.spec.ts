import {HalPropertyFactory} from './hal-property-factory';
import {HalValueType} from '../value-type/hal-value-type';
import {JsonArrayProperty, JsonObjectProperty} from '../../json-property/json-property';
import {HalResourceFactory} from './hal-resource-factory';
import {ResourceDescriptor} from '../../descriptor/resource-descriptor';
import {
  ArrayDescriptorMockBuilder, AssociationDescriptorMockBuilder, PropertyDescriptorMockBuilder,
  ResourceDescriptorMockBuilder
} from '../../descriptor/combining/property-descriptor-mock-builder.spec';

describe('HalPropertyFactory', () => {
  let resourceFactory: HalResourceFactory;
  let resourceDesc: ResourceDescriptor;

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
      'item': 1
    }]) as JsonArrayProperty<HalValueType>;

    const items = result.getArrayItems();
    expect(items.length).toBe(1);
    const item = items[0] as JsonObjectProperty<HalValueType>;
    expect(item.getChildProperties().length).toBe(1);
    expect(item.getChildProperties()[0].getDescriptor().getName()).toEqual('item');
  });
});
