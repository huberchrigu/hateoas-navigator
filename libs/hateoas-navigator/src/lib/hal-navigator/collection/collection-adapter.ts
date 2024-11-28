import {Observable} from 'rxjs';
import {ResourceObjectDescriptor} from '../descriptor';
import {HalResourceFactory} from '../hal-resource/factory/hal-resource-factory';
import {ResourceObjectProperty} from '../hal-resource';
import {ResourceService} from '../resource-services';
import {map} from 'rxjs/operators';

export class CollectionAdapter {
  constructor(private factory: HalResourceFactory, private resourceObject: ResourceObjectProperty) {

  }

  /**
   * We did not resolve associations, therefore use only the object state.
   */
  private static getNamesOfItem(resourceObject: ResourceObjectProperty) {
    return resourceObject.toRawObjectState().getChildProperties().map(p => p.getName());
  }

  resolve(): Observable<CollectionAdapter> {
    return this.factory.resolveDescriptor(this.resourceObject.getName(), this.resourceObject.getValue()!).pipe(
      map(resource => new CollectionAdapter(this.factory, resource))
    );
  }

  getResourceName() {
    return this.resourceObject.getName();
  }

  getDescriptor(): ResourceObjectDescriptor {
    return this.resourceObject.getDescriptor()!;
  }

  getItems(): Array<ResourceObjectProperty> {
    return this.getEmbeddedContent();
  }

  getPropertyNames(): Array<string> {
    const properties: any[] = [];
    this.getItems().forEach(item => {
      for (const property of CollectionAdapter.getNamesOfItem(item)) {
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

  filterByIds(ids: string[]): ResourceObjectProperty[] {
    return this.getItems().filter(item => ids.some(id => item.getSelfLink().getResourceId() === id));
  }

  private getEmbeddedContent(): ResourceObjectProperty[] {
    return this.resourceObject.getEmbeddedResources(
      this.resourceObject.getName(), true
    );
  }
}
