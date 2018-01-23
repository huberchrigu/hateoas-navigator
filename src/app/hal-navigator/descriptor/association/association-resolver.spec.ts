import {PropertyDescriptorMockBuilder} from '@hal-navigator/descriptor/combining/property-descriptor-mock-builder.spec';
import {AssociationResolver} from '@hal-navigator/descriptor/association/association-resolver';
import {ResourceDescriptorProvider} from '@hal-navigator/descriptor/provider/resource-descriptor-provider';
import {AssociatedPropertyDescriptor} from '@hal-navigator/descriptor/association/associated-property-descriptor';
import SpyObj = jasmine.SpyObj;
import {Observable} from 'rxjs/Observable';

describe('AssociationResolver', () => {
  it('should resolve associations', () => {
    const descriptorProviderMock: SpyObj<ResourceDescriptorProvider> = jasmine
      .createSpyObj<ResourceDescriptorProvider>('descriptorProvider', ['resolve']);
    descriptorProviderMock.resolve.and.callFake(resource => {
      const rootResource = Observable.of(new PropertyDescriptorMockBuilder()
        .withAssociatedResourceName(null)
        .withChildrenDescriptors([new PropertyDescriptorMockBuilder()
          .withAssociatedResourceName('associatedResource')
          .withChildrenDescriptors([])
          .withArrayItemsDescriptor(null)
          .build()])
        .withArrayItemsDescriptor(null)
        .build());
      const linkedResource = Observable.of(new PropertyDescriptorMockBuilder()
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
