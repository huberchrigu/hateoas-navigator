import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DateTimeFieldComponent} from './date-time-field.component';
import {DatePickerField, DateTimeType} from 'hateoas-navigator';
import {MatNativeDateModule} from '@angular/material/core';
import {By} from '@angular/platform-browser';
import moment from 'moment';

describe('DateTimeFieldComponent', () => {
  let component: DateTimeFieldComponent;
  let fixture: ComponentFixture<DateTimeFieldComponent>;
  const title = 'Date';
  const time = moment('2020-01-01T00:00:00').format();

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
    component.control.setValue(time);
    fixture.detectChanges();
  });

  it('should set date with timezone', () => {
    assertInputElement();
    expect(component.control.value).toBe(time);
    expect(component.dateTimeControl.value).toBe('2020-01-01T00:00');
    changeDate('2022-01-01T12:00');
    expect(component.control.value).toBe(moment('2022-01-01T12:00:00').format());
  });

  it('should support all types', () => {
    initField(DateTimeType.DATE);
    fixture.detectChanges();
    assertInputElement();
    initField(DateTimeType.TIME);
    fixture.detectChanges();
    assertInputElement();
  });

  function changeDate(date: string) {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    inputElement.value = date;
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function assertInputElement() {
    let inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.attributes['placeholder']).toBe(title);
  }

  function initField(type: DateTimeType) {
    component.field = new DatePickerField('date', true, false, title, type);
  }
});
