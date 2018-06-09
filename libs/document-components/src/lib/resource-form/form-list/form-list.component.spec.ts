import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormListComponent} from './form-list.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormArray} from '@angular/forms';
import {FormField} from 'hateoas-navigator';
import {ArrayField} from 'hateoas-navigator';

describe('FormListComponent', () => {
  let component: FormListComponent;
  let fixture: ComponentFixture<FormListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormListComponent);
    component = fixture.componentInstance;
    component.formArray = {} as FormArray;
    component.field = new ArrayField('field', undefined, true, 'Field', {} as FormField);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
