import {Observable} from 'rxjs';
import {ResourceDescriptor} from '../descriptor';
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

  getDescriptor(): ResourceDescriptor {
    return this.resourceObject.getDescriptor();
  }

  getItems(): Array<JsonResourceObject> {
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

  private getEmbeddedContent(): JsonResourceObject[] {
    return this.resourceObject.getEmbeddedResources(
      this.resourceObject.getName(), true
    );
  }

  /**
   * We did not resolve associations, therefore use only the object state.
   */
  private getNamesOfItem(resourceObject: JsonResourceObject) {
    return resourceObject.toRawObjectState().getChildProperties().map(p => p.getName());
  }
}
