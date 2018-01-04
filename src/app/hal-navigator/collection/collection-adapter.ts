import {ResourceAdapter} from '@hal-navigator/hal-resource/resource-adapter';
import {Observable} from 'rxjs/Observable';

export class CollectionAdapter {
  constructor(private resourceObject: ResourceAdapter) {

  }

  resolve(): Observable<ResourceAdapter> {
    return this.resourceObject.resolveDescriptor();
  }

  getResourceName() {
    return this.resourceObject.getName();
  }

  getDescriptor() {
    return this.resourceObject.getDescriptor();
  }

  getItems(): Array<ResourceAdapter> {
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

  private getEmbeddedContent(): ResourceAdapter[] {
    return this.resourceObject.getEmbeddedResources(
      this.resourceObject.getName(), true
    );
  }

  private getNamesOfItem(resourceObject: ResourceAdapter) {
    return resourceObject.getAllData().map(p => p.getName());
  }
}
