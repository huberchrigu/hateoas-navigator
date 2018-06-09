import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NavigationComponent} from './navigation.component';
import {HalDocumentService, NavigationFactory} from 'hateoas-navigator';
import {of} from 'rxjs/index';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  const serviceMock = {
    getRootNavigation: () => of({
      getItems: () => of([])
    } as NavigationFactory)
  } as HalDocumentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {provide: HalDocumentService, useValue: serviceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create an empty navigation item list', () => {
    expect(component.items.length).toBe(0);
  });
});
