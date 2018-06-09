import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HateoasNavigatorComponent } from './hateoas-navigator.component';

describe('HateoasNavigatorComponent', () => {
  let component: HateoasNavigatorComponent;
  let fixture: ComponentFixture<HateoasNavigatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HateoasNavigatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HateoasNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
