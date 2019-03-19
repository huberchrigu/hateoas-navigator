import {TestBed, inject} from '@angular/core/testing';

import {ResourceObjectResolverService} from './resource-object-resolver.service';
import {ResourceService} from '../resource-services/resource.service';
import {ResourceAdapterFactoryService} from 'hateoas-navigator/hal-navigator/hal-resource/resource-adapter-factory.service';

describe('ResourceObjectResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResourceObjectResolverService, {provide: ResourceService, useValue: {}}, {provide: ResourceAdapterFactoryService, useValue: {}}]
    });
  });

  it('should be created', inject([ResourceObjectResolverService], (service: ResourceObjectResolverService) => {
    expect(service).toBeTruthy();
  }));
});
