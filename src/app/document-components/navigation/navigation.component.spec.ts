import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NavigationComponent} from './navigation.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {HalDocumentService} from '@hal-navigator/resource-services/hal-document.service';
import {Observable} from 'rxjs/Observable';
import {NavigationFactory} from '@hal-navigator/navigation/navigation-factory';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: HalDocumentService, useValue: {
            getRootNavigation: () => Observable.of({
              getItems: () => Observable.of([])
            } as NavigationFactory)
          } as HalDocumentService
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create an empty navigation item list', () => {
    expect(component.items.length).toBe(0);
  });
});
