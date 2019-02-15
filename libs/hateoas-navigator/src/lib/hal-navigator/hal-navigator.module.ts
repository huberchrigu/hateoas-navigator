import {ModuleWithProviders, NgModule} from '@angular/core';
import {ResourceService} from './resource-services/resource.service';
import {CollectionResolverService} from './collection/collection-resolver.service';
import {ResourceObjectResolverService} from './item/resource-object-resolver.service';
import {ItemCacheService} from './item/cache/item-cache.service';
import {MODULE_CONFIG, ModuleConfiguration} from './config/module-configuration';
import {HttpClientModule} from '@angular/common/http';
import {ResourceDescriptorProvider} from './descriptor/provider/resource-descriptor-provider';
import {DeprecatedDescriptorProvider} from './descriptor/provider/deprecated-descriptor-provider';
import {ResourceSchemaService} from './resource-services/resource-schema.service';
import {ResourceDescriptorResolverService} from './descriptor/resolver/resource-descriptor-resolver.service';
import {ResourceAdapterFactoryService} from 'hateoas-navigator/hal-navigator/hal-resource/resource-adapter-factory.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    ResourceService,
    CollectionResolverService,
    ResourceDescriptorResolverService,
    ResourceObjectResolverService,
    ItemCacheService,
    ResourceSchemaService,
    ResourceAdapterFactoryService
  ]
})
export class HalNavigatorModule {
  static forRoot(configuration: ModuleConfiguration,
                 descriptorResolverFactory?: () => ResourceDescriptorProvider,
                 descriptorResolverDeps?: any[]): ModuleWithProviders {
    const factory = descriptorResolverFactory ? descriptorResolverFactory :
      (schemaService: ResourceSchemaService) => new DeprecatedDescriptorProvider(configuration, schemaService);
    const deps = descriptorResolverDeps ? descriptorResolverDeps : [ResourceSchemaService];
    return {
      ngModule: HalNavigatorModule,
      providers: [{
        provide: MODULE_CONFIG, useValue: configuration
      }, {
        provide: ResourceDescriptorProvider, useFactory: factory, deps: deps
      }]
    };
  }
}
