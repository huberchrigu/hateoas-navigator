import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {InputFieldComponent} from './input-field.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {FormField} from 'hateoas-navigator';
import {FormFieldType} from 'hateoas-navigator';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InputFieldComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
    component.field = new FormField('field', FormFieldType.TEXT, undefined, undefined, 'Field');
    component.control = {} as UntypedFormControl;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
