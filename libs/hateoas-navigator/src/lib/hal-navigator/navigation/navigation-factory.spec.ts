import {NavigationFactory} from './navigation-factory';
import {NavigationItem} from './navigation-item';
import {ResourceLink} from '../link-object/resource-link';
import {of} from 'rxjs/index';
import {JsonResourceObjectImpl} from '../hal-resource/json-resource-object-impl';

describe('NavigationFactory', () => {
  it('should get navigation items', () => {
    const resource = jasmine.createSpyObj<JsonResourceObjectImpl>('resource', ['getLinks']);
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
    linkMock.getResourceDescriptor.and.returnValue(of(descriptorMock));
    linkMock.getRelativeUriWithoutTemplatedPart.and.returnValue(uri);
    return linkMock;
  }
});
