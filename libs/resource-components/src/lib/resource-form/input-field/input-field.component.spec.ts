import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputFieldComponent} from './input-field.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FormField} from 'hateoas-navigator';
import {FormFieldType} from 'hateoas-navigator';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldComponent, BrowserAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
    component.field = new FormField('field', FormFieldType.TEXT, undefined, undefined, 'Field');
    component.control = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
