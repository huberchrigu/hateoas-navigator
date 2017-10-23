import {ItemAdapter} from '../item/item-adapter';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';

export class CollectionAdapter {
  constructor(private resourceObject: ResourceObjectAdapter) {

  }

  getResourceName() {
    return this.resourceObject.getResourceName();
  }

  getItems(): Array<ItemAdapter> {
    return this.getEmbeddedContent().map(item => new ItemAdapter(item));
  }

  getPropertyNames(): Array<string> {
    const properties = [];
    this.getItems().forEach(item => {
      for (const property of item.getProperties().getPropertyNames()) {
        if (properties.indexOf(property) < 0) {
          properties.push(property);
        }
      }
    });
    return properties;
  }

  private getEmbeddedContent(): ResourceObjectAdapter[] {
    return this.resourceObject.getEmbeddedObjects(
      this.resourceObject.getResourceName()
    );
  }
}
