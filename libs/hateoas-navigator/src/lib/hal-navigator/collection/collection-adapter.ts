import {Observable} from 'rxjs';
import {DeprecatedResourceDescriptor} from '../descriptor';
import {HalResourceFactory} from '../hal-resource/factory/hal-resource-factory';
import {JsonResourceObject} from '../hal-resource/resource-object';

export class CollectionAdapter {
  constructor(private factory: HalResourceFactory, private resourceObject: JsonResourceObject) {

  }

  resolve(): Observable<JsonResourceObject> {
    return this.factory.resolveDescriptor(this.resourceObject.getName(), this.resourceObject.getValue());
  }

  getResourceName() {
    return this.resourceObject.getName();
  }

  getDescriptor(): DeprecatedResourceDescriptor {
    return this.resourceObject.getDescriptor();
  }

  getItems(): Array<JsonResourceObject> {
    return this.getEmbeddedContent();
  }

  getPropertyNames(): Array<string> {
    const properties = [];
    this.getItems().forEach(item => {
      for (const property of CollectionAdapter.getNamesOfItem(item)) {
        if (properties.indexOf(property) < 0) {
          properties.push(property);
        }
      }
    });
    return properties;
  }

  private getEmbeddedContent(): JsonResourceObject[] {
    return this.resourceObject.getEmbeddedResources(
      this.resourceObject.getName(), true
    );
  }

  private static getNamesOfItem(resourceObject: JsonResourceObject) {
    return resourceObject.getPropertiesAndEmbeddedResourcesAsProperties().map(p => p.getName());
  }
}
