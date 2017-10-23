import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemPropertiesComponent} from './item-properties.component';
import {ResourceProperties} from '@hal-navigator/resource-object/properties/resource-properties';
import {SchemaAdapter} from '@hal-navigator/schema/schema-adapter';

describe('ItemPropertiesComponent', () => {
  let component: ItemPropertiesComponent;
  let fixture: ComponentFixture<ItemPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemPropertiesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPropertiesComponent);
    component = fixture.componentInstance as ItemPropertiesComponent;
    component.properties = {} as ResourceProperties;
    component['schema'] = {} as SchemaAdapter;

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
