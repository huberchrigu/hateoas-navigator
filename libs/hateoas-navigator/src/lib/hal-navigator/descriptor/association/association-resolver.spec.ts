import SpyObj = jasmine.SpyObj;
import {ResourceDescriptorProvider} from '../provider/resource-descriptor-provider';
import {PropertyDescriptorMockBuilder} from '../combining/property-descriptor-mock-builder.spec';
import {AssociationResolver} from './association-resolver';
import {Observable, of} from 'rxjs';
import {PropertyDescriptor} from 'hateoas-navigator';
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
      expect(descriptor.getChildrenDescriptors().length).toBe(1);
      expect(descriptor.getChildrenDescriptors()[0].getAssociatedResourceName()).toEqual('associatedResource');
      wasCalled = true;
    });
    jasmine.clock().tick(1000);
    expect(wasCalled).toBeTruthy();
  }));

  it('should work with cyclic associations', fakeAsync(() => {
    descriptorProviderMock.resolve.and.callFake(resource => getMockedPropertyDescriptor(resource, 'rootResource'));

    let wasCalled = false;
    testee.fetchDescriptorWithAssociations('rootResource').subscribe(descriptor => {
      expect(descriptor.getChildrenDescriptors().length).toBe(1);
      expect(descriptor.getChildrenDescriptors()[0].getAssociatedResourceName()).toEqual('rootResource');
      expect(descriptor.getChildrenDescriptors()[0].getChildDescriptor('rootResource')).toEqual(descriptor.getChildrenDescriptors()[0]);
      wasCalled = true;
    });
    jasmine.clock().tick(1000);
    expect(wasCalled).toBeTruthy();
  }));

  function getMockedPropertyDescriptor(resource: string, associationName: string): Observable<PropertyDescriptor> {
    const rootResource = of(new PropertyDescriptorMockBuilder()
      .withName(resource)
      .withAssociatedResourceName(null)
      .withChildrenDescriptors([new PropertyDescriptorMockBuilder()
        .withName(associationName)
        .withAssociatedResourceName(associationName)
        .withChildrenDescriptors([])
        .withArrayItemsDescriptor(null)
        .build()])
      .withArrayItemsDescriptor(null)
      .build());
    const linkedResource = of(new PropertyDescriptorMockBuilder()
      .withName(associationName)
      .withChildrenDescriptors([])
      .withArrayItemsDescriptor(null)
      .withAssociatedResourceName(null)
      .build());
    return resource === 'rootResource' ? rootResource : linkedResource;
  }
});
