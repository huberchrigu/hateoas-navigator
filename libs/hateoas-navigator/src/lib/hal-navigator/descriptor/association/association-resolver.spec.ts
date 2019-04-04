import SpyObj = jasmine.SpyObj;
import {ResourceDescriptorProvider} from '../provider/resource-descriptor-provider';
import {
  AssociationDescriptorMockBuilder,
  ObjectDescriptorMockBuilder
} from '../combining/property-descriptor-mock-builder.spec';
import {AssociationResolver} from './association-resolver';
import {Observable, of} from 'rxjs';
import {AssociationPropertyDescriptor, PropDescriptor} from '../prop-descriptor';
import {fakeAsync} from '@angular/core/testing';

describe('AssociationResolver', () => {
  let testee: AssociationResolver;

  let descriptorProviderMock: SpyObj<ResourceDescriptorProvider>;

  beforeAll(() => {
    descriptorProviderMock = jasmine.createSpyObj<ResourceDescriptorProvider>('descriptorProvider', ['resolve']);
  });

  beforeEach(() => {
    testee = new AssociationResolver(descriptorProviderMock);
  });

  it('should resolve associations', fakeAsync(() => {
    descriptorProviderMock.resolve.and.callFake(resource => getMockedPropertyDescriptor(resource, 'associatedResource'));

    let wasCalled = false;
    testee.fetchDescriptorWithAssociations('rootResource').subscribe(descriptor => {
      expect(descriptorProviderMock.resolve).toHaveBeenCalledWith('associatedResource');
      expect(descriptor.getChildDescriptors().length).toBe(1);
      expect(descriptor.getChildDescriptors()[0]
        .orNull<AssociationPropertyDescriptor, 'getAssociatedResourceName'>(d => d.getAssociatedResourceName))
        .toEqual('associatedResource');
      wasCalled = true;
    });
    jasmine.clock().tick(1000);
    expect(wasCalled).toBeTruthy();
  }));

  it('should work with cyclic associations', fakeAsync(() => {
    descriptorProviderMock.resolve.and.callFake(resource => getMockedPropertyDescriptor(resource, 'rootResource'));

    let wasCalled = false;
    testee.fetchDescriptorWithAssociations('rootResource').subscribe(descriptor => {
      expect(descriptor.getChildDescriptors().length).toBe(1);
      expect(descriptor.getChildDescriptors()[0].orNull(d => d.getAssociatedResourceName)).toEqual('rootResource');
      wasCalled = true;
    });
    jasmine.clock().tick(1000);
    expect(wasCalled).toBeTruthy();
  }));

  function getMockedPropertyDescriptor(resource: string, associationName: string): Observable<PropDescriptor> {
    const rootResource = of(new ObjectDescriptorMockBuilder()
      .withChildrenDescriptors([new AssociationDescriptorMockBuilder()
        .withAssociatedResourceName(associationName)
        .withName(associationName)
        .build()])
      .withName(resource)
      .build());
    const linkedResource = of(new ObjectDescriptorMockBuilder()
      .withChildrenDescriptors([])
      .withName(associationName)
      .build());
    return resource === 'rootResource' ? rootResource : linkedResource;
  }
});
