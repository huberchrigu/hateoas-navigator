import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemPropertiesComponent} from './item-properties.component';
import {SchemaAdapter} from '@hal-navigator/schema/schema-adapter';
import {ResourceProperty} from '@hal-navigator/resource-object/properties/resource-property';
import {HalDocumentService} from '@hal-navigator/hal-document/hal-document.service';
import {By} from '@angular/platform-browser';
import SpyObj = jasmine.SpyObj;

describe('ItemPropertiesComponent', () => {
  let component: ItemPropertiesComponent;
  let fixture: ComponentFixture<ItemPropertiesComponent>;
  let arrayProperty: SpyObj<ResourceProperty>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemPropertiesComponent],
      providers: [
        {provide: HalDocumentService, useValue: {}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPropertiesComponent);
    component = fixture.componentInstance as ItemPropertiesComponent;
    initArrayProperty();
    component.properties = [arrayProperty];
    component['schema'] = mockSchema();
    fixture.detectChanges();
  });

  it('should show sub-properties', () => {
    expect(fixture.debugElement.query(By.css('app-item-properties'))).toBeTruthy();
  });

  function initArrayProperty() {
    arrayProperty = jasmine.createSpyObj('arrayProperty', ['isArray', 'isUriType', 'getChildren', 'getName']);
    arrayProperty.isArray.and.returnValue(true);
    arrayProperty.getName.and.returnValue('array');
    arrayProperty.getChildren.and.returnValue([{getObjectProperties: () => []}]);
  }

  function mockSchema() {
    const schema = jasmine.createSpyObj<SchemaAdapter>('schemaAdapter', ['getSchema',
      'getPropertyDescriptor', 'getAlpsDescriptorForProperty']);
    schema.getSchema.and.returnValue({
      properties: {
        array: {
          items: {type: 'string'}
        }
      }
    });
    return schema;
  }
});
