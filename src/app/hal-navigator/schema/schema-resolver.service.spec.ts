import {TestBed, inject} from '@angular/core/testing';

import {SchemaResolverService} from './schema-resolver.service';
import {HalDocumentService} from '@hal-navigator/hal-document/hal-document.service';

describe('SchemaResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchemaResolverService, {provide: HalDocumentService, useValue: {}}]
    });
  });

  it('should be created', inject([SchemaResolverService], (service: SchemaResolverService) => {
    expect(service).toBeTruthy();
  }));
});
