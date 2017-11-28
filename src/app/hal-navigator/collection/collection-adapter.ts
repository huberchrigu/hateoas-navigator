import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';

export class CollectionAdapter {
  constructor(private resourceObject: ResourceObjectAdapter) {

  }

  getResourceName() {
    return this.resourceObject.getResourceName();
  }

  getItems(): Array<ResourceObjectAdapter> {
    return this.getEmbeddedContent();
  }

  getPropertyNames(): Array<string> {
    const properties = [];
    this.getItems().forEach(item => {
      for (const property of this.getNamesOfItem(item)) {
        if (properties.indexOf(property) < 0) {
          properties.push(property);
        }
      }
    });
    return properties;
  }

  private getEmbeddedContent(): ResourceObjectAdapter[] {
    return this.resourceObject.getEmbeddedResources(
      this.resourceObject.getResourceName()
    );
  }

  private getNamesOfItem(resourceObject: ResourceObjectAdapter) {
    return resourceObject.getAllData().map(p => p.getName());
  }
}
