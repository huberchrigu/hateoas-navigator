import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NavigationComponent} from './navigation.component';
import {ResourceService, NavigationFactory} from 'hateoas-navigator';
import {of} from 'rxjs';
import {LoginService} from './login';
import {ActivatedRoute} from '@angular/router';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  const serviceMock = {
    getRootNavigation: () => of({
      getItems: () => of([])
    } as unknown as NavigationFactory)
  } as ResourceService;

  const loginMock = jasmine.createSpyObj<LoginService>(['isLoggedIn', 'getUserId']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {provide: ResourceService, useValue: serviceMock},
        {provide: LoginService, useValue: loginMock},
        {provide: ActivatedRoute, useValue: {}}
      ]
    })
      .compileComponents();
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create an empty navigation item list', () => {
    expect(component.items.length).toBe(0);
  });
});
