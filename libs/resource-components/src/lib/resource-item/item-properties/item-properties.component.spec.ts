import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemPropertiesComponent} from './item-properties.component';
import {By} from '@angular/platform-browser';
import {ArrayDescriptor, JsonArrayProperty} from 'hateoas-navigator';
import {ArrayPropertyImpl} from 'hateoas-navigator';

describe('ItemPropertiesComponent', () => {
  let component: ItemPropertiesComponent;
  let fixture: ComponentFixture<ItemPropertiesComponent>;
  let arrayProperty: JsonArrayProperty;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemPropertiesComponent]
    })
      .compileComponents();
  });

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
    // @ts-ignore
    arrayProperty = new ArrayPropertyImpl('array', [], {getTitle: () => 'Array'} as ArrayDescriptor, null);
  }
});
