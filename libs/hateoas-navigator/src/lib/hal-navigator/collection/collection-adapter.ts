import {Observable} from 'rxjs';
import {ResourceDescriptor} from '../descriptor';
import {HalResourceFactory} from '../hal-resource/factory/hal-resource-factory';
import {JsonResourceObject} from '../hal-resource/resource-object';
import {ResourceService} from 'hateoas-navigator/hal-navigator';
import {map} from 'rxjs/operators';

export class CollectionAdapter {
  constructor(private factory: HalResourceFactory, private resourceObject: JsonResourceObject) {

  }

  resolve(): Observable<CollectionAdapter> {
    return this.factory.resolveDescriptor(this.resourceObject.getName(), this.resourceObject.getValue()).pipe(
      map(resource => new CollectionAdapter(this.factory, resource))
    );
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

  getSearchUrls(resourceService: ResourceService) {
    return resourceService.getItem(this.resourceObject.getName(), 'search').pipe(map(obj => obj.getOtherLinks()));
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
