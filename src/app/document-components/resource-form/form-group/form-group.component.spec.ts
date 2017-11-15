import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormGroupComponent} from './form-group.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormGroup} from '@angular/forms';

describe('FormGroupComponent', () => {
  let component: FormGroupComponent;
  let fixture: ComponentFixture<FormGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormGroupComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGroupComponent);
    component = fixture.componentInstance;
    component.fields = [];
    component.formGroup = {controls: {}} as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
