import {HalResourceFactory} from './factory/hal-resource-factory';
import {ResourceDescriptorProvider} from '../descriptor/provider/resource-descriptor-provider';
import {HalResourceObject} from './value-type/hal-value-type';
import {ResourceObjectPropertyImpl} from './resource-object-property-impl';
import {ResourceObjectDescriptor} from '../descriptor/resource-object-descriptor';
import {HalPropertyFactory} from './factory/hal-property-factory';
import {LinkFactory} from '../link-object/link-factory';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AssociationResolver} from '../descriptor/association/association-resolver';
import {ResourceObjectProperty, VersionedResourceObjectProperty} from './resource-object-property';
import {VersionedResourceObjectPropertyImpl} from '../item/versioned-resource-object-property-impl';
import {Injectable} from '@angular/core';
import {ObjectDescriptor} from '../descriptor/generic-property-descriptor';

@Injectable()
export class ResourceObjectPropertyFactoryService implements HalResourceFactory {
  constructor(private descriptorResolver: ResourceDescriptorProvider) {
  }

  private static assertObj(resourceObject: HalResourceObject) {
    if (Array.isArray(resourceObject)) {
      throw new Error('This is not a valid resource object: ' + JSON.stringify(resourceObject));
    }
  }

  private static getSubResourceDescriptor(embeddedRelationType: string, descriptor: ResourceObjectDescriptor): ResourceObjectDescriptor {
    return descriptor ? descriptor.orNull<ObjectDescriptor, 'getChildDescriptor'>(d =>
      d.getChildDescriptor, embeddedRelationType) as ResourceObjectDescriptor : undefined;
  }

  create(name: string, resourceObject: HalResourceObject, descriptor: ResourceObjectDescriptor): ResourceObjectProperty {
    ResourceObjectPropertyFactoryService.assertObj(resourceObject);
    return new ResourceObjectPropertyImpl(name, resourceObject, this.getPropertyFactory(descriptor), this,
      this.getLinkFactory(resourceObject), descriptor);
  }

  resolveDescriptor(name: string, resourceObject: HalResourceObject): Observable<ResourceObjectProperty> {
    return this.descriptorResolver.resolve(name).pipe(
      map(descriptor => {
        if (!descriptor) {
          throw new Error('The descriptor resolver should return a descriptor');
        }
        return this.create(name, resourceObject, descriptor);
      }));
  }

  resolveDescriptorAndAssociations(name: string, resourceObject: HalResourceObject,
                                   version: string): Observable<VersionedResourceObjectProperty> {
    return new AssociationResolver(this.descriptorResolver).fetchDescriptorWithAssociations(name).pipe(
      map(descriptor => {
        return this.createWithVersion(name, resourceObject, descriptor, version);
      }));
  }

  createWithVersion(name: string, resourceObject: HalResourceObject, descriptor: ResourceObjectDescriptor, version: string):
    VersionedResourceObjectProperty {
    ResourceObjectPropertyFactoryService.assertObj(resourceObject);
    return new VersionedResourceObjectPropertyImpl(version, name, resourceObject, this.getPropertyFactory(descriptor), this,
      this.getLinkFactory(resourceObject), descriptor);
  }

  createResourceObjectProperty(name: string, obj: HalResourceObject, useMainDescriptor: boolean, descriptor: ResourceObjectDescriptor) {
    return this.create(name, obj, useMainDescriptor ?
      descriptor :
      ResourceObjectPropertyFactoryService.getSubResourceDescriptor(name, descriptor));
  }

  private getLinkFactory(resourceObject: HalResourceObject) {
    return new LinkFactory(resourceObject._links, this.descriptorResolver);
  }

  private getPropertyFactory(descriptor: ResourceObjectDescriptor) {
    return new HalPropertyFactory(this, descriptor);
  }
}
