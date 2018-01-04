import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FormField} from '@hal-navigator/form/form-field';
import {SelectFieldComponent} from '@document-components/resource-form/select-field/select-field.component';
import {By} from '@angular/platform-browser';

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
    component.field = {
      options: {
        getOptions: () => [1, 2, 3]
      }
    } as FormField;
    component.control = {} as FormControl;
    fixture.detectChanges();
  });

  it('should contain all three options', () => {
    const options = fixture.debugElement.queryAll(By.css('mat-option'));
    expect(options.length).toBe(3);
  });
});
