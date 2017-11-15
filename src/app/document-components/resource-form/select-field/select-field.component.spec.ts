import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormField} from '@hal-navigator/schema/form/form-field';
import {SelectFieldComponent} from '@document-components/resource-form/select-field/select-field.component';

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent;
  let fixture: ComponentFixture<SelectFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectFieldComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFieldComponent);
    component = fixture.componentInstance;
    component.field = {} as FormField;
    component.formGroup = {} as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
