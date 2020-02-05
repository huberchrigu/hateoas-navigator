import {TestBed, inject} from '@angular/core/testing';

import {ResourceObjectResolverService} from './resource-object-resolver.service';
import {ResourceService} from '../resource-services/resource.service';
import {ResourceObjectPropertyFactoryService} from '../hal-resource/resource-object-property-factory.service';

describe('ResourceObjectResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResourceObjectResolverService,
        {provide: ResourceService, useValue: {}},
        {provide: ResourceObjectPropertyFactoryService, useValue: {}}
      ]
    });
  });

  it('should be created', inject([ResourceObjectResolverService], (service: ResourceObjectResolverService) => {
    expect(service).toBeTruthy();
  }));
});
