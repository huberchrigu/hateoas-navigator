import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemPropertiesComponent} from './item-properties.component';
import {ResourceProperty} from 'hateoas-navigator';
import {By} from '@angular/platform-browser';
import SpyObj = jasmine.SpyObj;

describe('ItemPropertiesComponent', () => {
  let component: ItemPropertiesComponent;
  let fixture: ComponentFixture<ItemPropertiesComponent>;
  let arrayProperty: SpyObj<ResourceProperty>;

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

  it('should show sub-properties', () => {
    expect(fixture.debugElement.query(By.css('app-item-properties'))).toBeTruthy();
  });

  function initArrayProperty() {
    arrayProperty = jasmine.createSpyObj('arrayProperty', ['isArray', 'getArrayItems', 'getName', 'getDescriptor']);
    arrayProperty.isArray.and.returnValue(true);
    arrayProperty.getName.and.returnValue('array');
    arrayProperty.getArrayItems.and.returnValue([{getObjectProperties: () => []}]);
    arrayProperty.getDescriptor.and.returnValue({getTitle: () => 'Array'});
  }
});
