import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SubFormArrayComponent} from './sub-form-array.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormArray} from '@angular/forms';
import {FormField} from '@hal-navigator/schema/form/form-field';

describe('SubFormArrayComponent', () => {
  let component: SubFormArrayComponent;
  let fixture: ComponentFixture<SubFormArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubFormArrayComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubFormArrayComponent);
    component = fixture.componentInstance;
    component.formArray = {} as FormArray;
    component.field = {} as FormField;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
