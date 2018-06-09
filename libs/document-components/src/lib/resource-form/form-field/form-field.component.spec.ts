import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormFieldComponent} from './form-field.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormField} from 'hateoas-navigator';
import {FormControl} from '@angular/forms';
import {By} from '@angular/platform-browser';
import SpyObj = jasmine.SpyObj;
import {SubFormField} from 'hateoas-navigator';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;
  let control: SpyObj<FormControl>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormFieldComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    control = jasmine.createSpyObj<FormControl>('FormControl', ['hasError']);
    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    component.field = new SubFormField('field', true, false, 'Field', [{} as FormField]);
    component.control = control;
  });

  it('should not show error if not touched', () => {
    control.hasError.and.returnValue(true);
    fixture.detectChanges();
    const errorElement = getErrorDebugElement();

    expect(errorElement).toBeFalsy();
  });

  it('should show error if touched', () => {
    control.hasError.and.returnValue(true);
    Object.defineProperty(control, 'touched', {
      get: () => true
    });
    fixture.detectChanges();
    const errorElement = getErrorDebugElement();

    expect(errorElement).toBeTruthy();
  });

  function getErrorDebugElement() {
    return fixture.debugElement.query(By.css('mat-error'));
  }
});
