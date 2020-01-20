import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemPropertiesComponent} from './item-properties.component';
import {By} from '@angular/platform-browser';
import {ArrayPropertyDescriptor, JsonArrayProperty} from 'hateoas-navigator';
import {ArrayPropertyImpl} from 'hateoas-navigator';

describe('ItemPropertiesComponent', () => {
  let component: ItemPropertiesComponent;
  let fixture: ComponentFixture<ItemPropertiesComponent>;
  let arrayProperty: JsonArrayProperty;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemPropertiesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPropertiesComponent);
    component = fixture.componentInstance as ItemPropertiesComponent;
    initArrayProperty();
    component.properties = [arrayProperty];
    fixture.detectChanges();
  });

  it(`should show the array property's title`, () => {
    const titleElement: Element = fixture.debugElement.query(By.css('h2.mat-h2')).nativeElement;
    expect(titleElement.textContent).toEqual('Array');
  });

  /**
   * Jasmine mock cannot be used due to `instanceof` usage.
   */
  function initArrayProperty() {
    arrayProperty = new ArrayPropertyImpl('array', [], {getTitle: () => 'Array'} as ArrayPropertyDescriptor, null);
  }
});
