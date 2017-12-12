import {NavigationFactory} from '@hal-navigator/navigation/navigation-factory';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';
import {ResourceLink} from '@hal-navigator/link-object/resource-link';
import {Observable} from 'rxjs/Observable';
import {NavigationItem} from '@hal-navigator/navigation/navigation-item';

describe('NavigationFactory', () => {
  it('should get navigation items', () => {
    const resource = jasmine.createSpyObj<ResourceObjectAdapter>('resource', ['getLinks']);
    resource.getLinks.and.returnValue([
      mockLink('profile', '/profile', 'Profile'),
      mockLink('collection', '/collection', 'Collection')
    ]);
    const testee = new NavigationFactory(resource);
    testee.getItems().subscribe(items => {
      expect(items).toEqual([new NavigationItem('/collection', 'Collection')]);
    });
  });

  function mockLink(relationType: string, uri: string, title: string): ResourceLink {
    const descriptorMock = jasmine.createSpyObj('resourceDescriptor', ['getTitle', 'getName']);
    descriptorMock.getTitle.and.returnValue(title);
    const linkMock = jasmine.createSpyObj<ResourceLink>('resourceLink',
      ['getRelationType', 'getResourceDescriptor', 'getRelativeUriWithoutTemplatedPart']);
    linkMock.getRelationType.and.returnValue(relationType);
    linkMock.getResourceDescriptor.and.returnValue(Observable.of(descriptorMock));
    linkMock.getRelativeUriWithoutTemplatedPart.and.returnValue(uri);
    return linkMock;
  }
});
