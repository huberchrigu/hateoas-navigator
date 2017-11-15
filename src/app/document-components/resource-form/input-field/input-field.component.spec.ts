import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InputFieldComponent} from './input-field.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormField} from '@hal-navigator/schema/form/form-field';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputFieldComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
    component.field = {} as FormField;
    component.formGroup = {} as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
