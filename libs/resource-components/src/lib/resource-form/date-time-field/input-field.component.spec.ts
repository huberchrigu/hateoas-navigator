import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DateTimeFieldComponent} from './date-time-field.component';
import {DatePickerField, DateTimeType} from 'hateoas-navigator';
import {MatNativeDateModule} from '@angular/material/core';
import {By} from '@angular/platform-browser';

describe('DateTimeFieldComponent', () => {
  let component: DateTimeFieldComponent;
  let fixture: ComponentFixture<DateTimeFieldComponent>;
  const title = 'Date';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTimeFieldComponent, BrowserAnimationsModule, MatNativeDateModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeFieldComponent);
    component = fixture.componentInstance;
    initField(DateTimeType.DATE_TIME);
    component.control = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    assertInputElement();
  });

  it('should support all types', () => {
    initField(DateTimeType.DATE);
    fixture.detectChanges();
    assertInputElement();
    initField(DateTimeType.TIME);
    fixture.detectChanges();
    assertInputElement();
  });

  function assertInputElement() {
    let inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.attributes['placeholder']).toBe(title);
  }

  function initField(type: DateTimeType) {
    component.field = new DatePickerField('date', true, false, title, type);
  }
});
