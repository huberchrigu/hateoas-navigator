import {HalResourceFactory} from './factory/hal-resource-factory';
import {ResourceDescriptorProvider} from '../descriptor/provider/resource-descriptor-provider';
import {HalResourceObject} from './value-type/hal-value-type';
import {ResourceAdapter} from './resource-adapter';
import {ResourceDescriptor} from '../descriptor/resource-descriptor';
import {HalPropertyFactory} from './factory/hal-property-factory';
import {LinkFactory} from '../link-object/link-factory';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AssociationResolver} from '../descriptor/association/association-resolver';
import {JsonResourceObject, VersionedJsonResourceObject} from './resource-object';
import {VersionedResourceAdapter} from '../item/versioned-resource-adapter';
import {Injectable} from '@angular/core';

@Injectable()
export class ResourceAdapterFactoryService implements HalResourceFactory {
  constructor(private descriptorResolver: ResourceDescriptorProvider) {
  }

  private static assertObj(resourceObject: HalResourceObject) {
    if (Array.isArray(resourceObject)) {
      throw new Error('This is not a valid resource object: ' + JSON.stringify(resourceObject));
    }
  }

  create(name: string, resourceObject: HalResourceObject, descriptor: ResourceDescriptor): JsonResourceObject {
    ResourceAdapterFactoryService.assertObj(resourceObject);
    return new ResourceAdapter(name, resourceObject, this.getPropertyFactory(descriptor), this, this.getLinkFactory(resourceObject),
      descriptor);
  }

  resolveDescriptor(name: string, resourceObject: HalResourceObject): Observable<JsonResourceObject> {
    return this.descriptorResolver.resolve(name).pipe(
      map(descriptor => {
        if (!descriptor) {
          throw new Error('The descriptor resolver should return a descriptor');
        }
        return this.create(name, resourceObject, descriptor);
      }));
  }

  resolveDescriptorAndAssociations(name: string, resourceObject: HalResourceObject,
                                   version: string): Observable<VersionedJsonResourceObject> {
    return new AssociationResolver(this.descriptorResolver).fetchDescriptorWithAssociations(name).pipe(
      map(descriptor => {
        return this.createWithVersion(name, resourceObject, descriptor, version);
      }));
  }

  createWithVersion(name: string, resourceObject: HalResourceObject, descriptor: ResourceDescriptor, version: string):
    VersionedJsonResourceObject {
    ResourceAdapterFactoryService.assertObj(resourceObject);
    return new VersionedResourceAdapter(version, name, resourceObject, this.getPropertyFactory(descriptor), this,
      this.getLinkFactory(resourceObject), descriptor);
  }

  private getLinkFactory(resourceObject: HalResourceObject) {
    return new LinkFactory(resourceObject._links, this.descriptorResolver);
  }

  private getPropertyFactory(descriptor: ResourceDescriptor) {
    return new HalPropertyFactory(this, descriptor);
  }
}
