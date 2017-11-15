import {Component, Input, OnInit} from '@angular/core';
import {SchemaAdapter} from '@hal-navigator/schema/schema-adapter';
import {NotNull} from '../../../decorators/not-null';
import {SchemaReferenceFactory} from '@hal-navigator/schema/schema-reference-factory';
import {ResourceProperty} from '@hal-navigator/resource-object/properties/resource-property';
import {ResourceProperties} from '@hal-navigator/resource-object/properties/resource-properties';
import {JsonSchema} from '@hal-navigator/schema/json-schema';

@Component({
  selector: 'app-item-properties',
  templateUrl: './item-properties.component.html',
  styleUrls: ['./item-properties.component.sass']
})
export class ItemPropertiesComponent implements OnInit {

  @Input()
  properties: ResourceProperties;

  @Input()
  private schema: SchemaAdapter;

  private schemaReferenceFactory: SchemaReferenceFactory;

  ngOnInit() {
    this.schemaReferenceFactory = new SchemaReferenceFactory(this.schema.getSchema().definitions);
  }

  getPropertyTitle(property: ResourceProperty): string {
    return this.getPropertySchema(property).title;
  }

  isArray(property: ResourceProperty): boolean {
    return Array.isArray(this.getPropertyValue(property));
  }

  @NotNull()
  getDefinition(arrayProperty: ResourceProperty): SchemaAdapter {
    const reference = this.getPropertySchema(arrayProperty).items;
    const schema = this.schemaReferenceFactory.getReferencedSchema(reference);
    const alpsDescriptor = this.schema.getAlpsDescriptorForProperty(arrayProperty.getName());
    const itemDescriptor = this.schema.getPropertyDescriptor(arrayProperty.getName());
    return new SchemaAdapter(schema, alpsDescriptor, itemDescriptor);
  }

  private getPropertyValue(property: ResourceProperty): any {
    return property.getValue();
  }

  @NotNull()
  private getPropertySchema(property: ResourceProperty): JsonSchema {
    return this.schema.getSchema().properties[property.getName()];
  }
}
