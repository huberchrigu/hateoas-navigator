import {TestBed, inject} from '@angular/core/testing';

import {ResourceObjectResolverService} from './item-resolver.service';
import {HalDocumentService} from '@hal-navigator/resource-services/hal-document.service';

describe('ItemResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResourceObjectResolverService, {provide: HalDocumentService, useValue: {}}]
    });
  });

  it('should be created', inject([ResourceObjectResolverService], (service: ResourceObjectResolverService) => {
    expect(service).toBeTruthy();
  }));
});
