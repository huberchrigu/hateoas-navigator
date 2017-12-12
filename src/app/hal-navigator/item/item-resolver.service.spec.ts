import {TestBed, inject} from '@angular/core/testing';

import {ItemResolverService} from './item-resolver.service';
import {HalDocumentService} from '@hal-navigator/resource-services/hal-document.service';

describe('ItemResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemResolverService, {provide: HalDocumentService, useValue: {}}]
    });
  });

  it('should be created', inject([ItemResolverService], (service: ItemResolverService) => {
    expect(service).toBeTruthy();
  }));
});
