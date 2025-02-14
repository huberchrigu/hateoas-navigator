import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormFieldComponent} from './form-field.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormField, SubFormField} from 'hateoas-navigator';
import {UntypedFormGroup} from '@angular/forms';
import {By} from '@angular/platform-browser';
import SpyObj = jasmine.SpyObj;
import {DUMMY_CUSTOM_COMPONENT_SERVICE_PROVIDER} from '../../customizable/dummy.component';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;
  let control: SpyObj<UntypedFormGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [DUMMY_CUSTOM_COMPONENT_SERVICE_PROVIDER]
    })
      .compileComponents();
  });

  beforeEach(() => {
    control = jasmine.createSpyObj<UntypedFormGroup>('FormControl', ['hasError']);
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

