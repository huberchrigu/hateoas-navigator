import {PropertyDescriptorMockBuilder} from '@hal-navigator/descriptor/combining/property-descriptor-mock-builder.spec';
import {AssociationResolver} from '@hal-navigator/descriptor/association/association-resolver';
import {ResourceDescriptorProvider} from '@hal-navigator/descriptor/provider/resource-descriptor-provider';
import {AssociatedDescriptor} from '@hal-navigator/descriptor/association/associated-descriptor';
import SpyObj = jasmine.SpyObj;
import {Observable} from 'rxjs/Observable';

describe('AssociationResolver', () => {
  it('should resolve associations', () => {
    const descriptorProviderMock: SpyObj<ResourceDescriptorProvider> = jasmine
      .createSpyObj<ResourceDescriptorProvider>('descriptorProvider', ['resolve']);
    descriptorProviderMock.resolve.and.callFake(resource => {
      const rootResource = Observable.of(new PropertyDescriptorMockBuilder()
        .withAssociatedResourceName(null)
        .withChildren([new PropertyDescriptorMockBuilder()
          .withAssociatedResourceName('associatedResource')
          .withChildren([])
          .build()])
        .build());
      const linkedResource = Observable.of(new PropertyDescriptorMockBuilder()
        .withChildren([])
        .withAssociatedResourceName(null)
        .build());
      return resource === 'rootResource' ? rootResource : linkedResource;
    });

    const testee = new AssociationResolver(descriptorProviderMock);

    testee.fetchDescriptorWithAssociations('rootResource').subscribe((descriptor: AssociatedDescriptor) => {
      expect(descriptorProviderMock.resolve).toHaveBeenCalledWith('associatedResource');
      expect(descriptor.getChildren().length).toBe(1);
      expect(descriptor.getChildren()[0].getAssociatedResourceName()).toEqual('associatedResource');
    });
  });
});
