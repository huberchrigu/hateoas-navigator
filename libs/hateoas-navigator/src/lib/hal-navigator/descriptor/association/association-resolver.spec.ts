import SpyObj = jasmine.SpyObj;
import {ResourceDescriptorProvider} from '../provider/resource-descriptor-provider';
import {PropertyDescriptorMockBuilder} from '../combining/property-descriptor-mock-builder.spec';
import {AssociationResolver} from './association-resolver';
import {AssociatedPropertyDescriptor} from './associated-property-descriptor';
import {of} from 'rxjs/index';

describe('AssociationResolver', () => {
  it('should resolve associations', () => {
    const descriptorProviderMock: SpyObj<ResourceDescriptorProvider> = jasmine
      .createSpyObj<ResourceDescriptorProvider>('descriptorProvider', ['resolve']);
    descriptorProviderMock.resolve.and.callFake(resource => {
      const rootResource = of(new PropertyDescriptorMockBuilder()
        .withAssociatedResourceName(null)
        .withChildrenDescriptors([new PropertyDescriptorMockBuilder()
          .withAssociatedResourceName('associatedResource')
          .withChildrenDescriptors([])
          .withArrayItemsDescriptor(null)
          .build()])
        .withArrayItemsDescriptor(null)
        .build());
      const linkedResource = of(new PropertyDescriptorMockBuilder()
        .withChildrenDescriptors([])
        .withArrayItemsDescriptor(null)
        .withAssociatedResourceName(null)
        .build());
      return resource === 'rootResource' ? rootResource : linkedResource;
    });

    const testee = new AssociationResolver(descriptorProviderMock);

    testee.fetchDescriptorWithAssociations('rootResource').subscribe((descriptor: AssociatedPropertyDescriptor) => {
      expect(descriptorProviderMock.resolve).toHaveBeenCalledWith('associatedResource');
      expect(descriptor.getChildrenDescriptors().length).toBe(1);
      expect(descriptor.getChildrenDescriptors()[0].getAssociatedResourceName()).toEqual('associatedResource');
    });
  });
});
