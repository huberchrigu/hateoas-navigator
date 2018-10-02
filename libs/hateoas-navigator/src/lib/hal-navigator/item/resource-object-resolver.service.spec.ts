import {TestBed, inject} from '@angular/core/testing';

import {ResourceObjectResolverService} from './resource-object-resolver.service';
import {HalDocumentService} from '../resource-services/hal-document.service';

describe('ResourceObjectResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResourceObjectResolverService, {provide: HalDocumentService, useValue: {}}]
    });
  });

  it('should be created', inject([ResourceObjectResolverService], (service: ResourceObjectResolverService) => {
    expect(service).toBeTruthy();
  }));
});
