import {HalDocumentService} from '@hal-navigator/resource-services/hal-document.service';
import createSpyObj = jasmine.createSpyObj;
import {HttpClient} from '@angular/common/http';
import {ItemCacheService} from '@hal-navigator/item/cache/item-cache.service';
import {ModuleConfiguration} from '@hal-navigator/config/module-configuration';
import {Observable} from 'rxjs/Observable';
import {ResourceDescriptorResolver} from '@hal-navigator/descriptor/resource-descriptor-resolver';

describe('HalDocumentService', () => {
  let testee: HalDocumentService;
  const httpClientMock = createSpyObj<HttpClient>('httpClient', ['get']);
  const itemCacheServiceMock: ItemCacheService = createSpyObj('resourceCacheService', ['notUsedYet']);

  beforeAll(() => {
    httpClientMock.get.and.returnValue(Observable.of({
      body: {
        _links: {
          aggregate1: {href: 'http://localhost:8080/aggregate1'},
          aggregate2: {href: 'http://localhost:8080/aggregate2'},
          profile: {href: 'http://localhost:8080/profile'}
        }
      }
    }));
    testee = new HalDocumentService(httpClientMock, itemCacheServiceMock, {} as ModuleConfiguration, {} as ResourceDescriptorResolver);
  });

  it('should return all collection links excl. "profile"', async () => {
    testee.getRootNavigation().flatMap(navigation => navigation.getItems()).subscribe(items => {
      expect(items.length).toBe(2);
    });
  });
});
