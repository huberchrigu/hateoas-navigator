import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SelectFieldComponent} from './select-field.component';
import {By} from '@angular/platform-browser';
import {SelectField} from 'hateoas-navigator';

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
    component.field = new SelectField('field', undefined, undefined, 'Field', [1, 2, 3]);
    component.control = {} as FormControl;
    fixture.detectChanges();
  });

  it('should contain all three options', () => {
    const options = fixture.debugElement.queryAll(By.css('mat-option'));
    expect(options.length).toBe(3);
  });
});
