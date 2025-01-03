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
  });

  it('should set date with timezone', () => {
    component.control = new FormControl(time);
    initField(DateTimeType.DATE_TIME);
    fixture.detectChanges();
    assertPlaceholder();
    expect(component.control.value).toBe(time);
    expect(component.dateTimeControl.value).toBe('2020-01-01T00:00');
    changeDate('2022-01-01T12:00');
    expect(component.control.value).toBe(moment('2022-01-01T12:00:00').format());
  });

  it('should set time with timezone', () => {
    component.control = new FormControl();
    initField(DateTimeType.TIME);
    fixture.detectChanges();
    changeTime('08:00 AM');
    let expected = moment().set({hour: 8, minute: 0, second: 0}).toDate().toString();
    expect(component.control.value.toString()).toEqual(expected);
  });

  it('should support all types', () => {
    component.control = new FormControl();
    initField(DateTimeType.DATE_TIME);
    fixture.detectChanges();
    assertPlaceholder();
    initField(DateTimeType.DATE);
    fixture.detectChanges();
    assertLabel();
    initField(DateTimeType.TIME);
    fixture.detectChanges();
    assertLabel();
  });

  function changeDate(date: string) {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    inputElement.value = date;
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function changeTime(time: string) {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    inputElement.value = time;
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function assertPlaceholder() {
    let inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.attributes['placeholder']).toBe(title);
  }

  function assertLabel() {
    const labelElement = fixture.debugElement.query(By.css('mat-label')).nativeElement as HTMLElement;
    expect(labelElement.textContent).toBe(title);
  }

  function initField(type: DateTimeType) {
    component.field = new DatePickerField('date', true, false, title, type);
  }
});
