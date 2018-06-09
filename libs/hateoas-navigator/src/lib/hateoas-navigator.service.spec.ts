import { TestBed, inject } from '@angular/core/testing';

import { HateoasNavigatorService } from './hateoas-navigator.service';

describe('HateoasNavigatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HateoasNavigatorService]
    });
  });

  it('should be created', inject([HateoasNavigatorService], (service: HateoasNavigatorService) => {
    expect(service).toBeTruthy();
  }));
});
