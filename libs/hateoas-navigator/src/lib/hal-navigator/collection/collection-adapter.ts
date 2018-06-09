import {Observable} from 'rxjs';
import {ResourceAdapter} from '../hal-resource/resource-adapter';
import {ResourceDescriptor} from '../descriptor';

export class CollectionAdapter {
  constructor(private resourceObject: ResourceAdapter) {

  }

  resolve(): Observable<ResourceAdapter> {
    return this.resourceObject.resolveDescriptor();
  }

  getResourceName() {
    return this.resourceObject.getName();
  }

  getDescriptor(): ResourceDescriptor {
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
    return resourceObject.getPropertiesAndEmbeddedResourcesAsProperties().map(p => p.getName());
  }
}
