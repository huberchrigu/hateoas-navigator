import {ModuleWithProviders, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ResourceService} from './resource-services';
import {CollectionResolverService} from './collection';
import {ResourceObjectResolverService} from './item';
import {ItemCacheService} from './item/cache/item-cache.service';
import {MODULE_CONFIG, ModuleConfiguration} from './config';
import {ResourceDescriptorProvider} from './descriptor/provider/resource-descriptor-provider';
import {DefaultDescriptorProvider} from './descriptor/provider/default-descriptor-provider';
import {ResourceDescriptorResolverService} from './descriptor';
import {ResourceSchemaService} from './resource-services/resource-schema.service';
import {ResourceObjectPropertyFactoryService} from './hal-resource';

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
    ResourceObjectPropertyFactoryService
  ]
})
export class HalNavigatorModule {
  static forRoot(configuration: ModuleConfiguration,
                 descriptorResolverFactory?: () => ResourceDescriptorProvider,
                 descriptorResolverDeps?: any[]): ModuleWithProviders<HalNavigatorModule> {
    const factory = descriptorResolverFactory ? descriptorResolverFactory :
      (schemaService: ResourceSchemaService) => new DefaultDescriptorProvider(configuration, schemaService);
    const deps = descriptorResolverDeps ? descriptorResolverDeps : [ResourceSchemaService];
    return {
      ngModule: HalNavigatorModule,
      providers: [{
        provide: MODULE_CONFIG, useValue: configuration
      }, {
        provide: ResourceDescriptorProvider, useFactory: factory, deps
      },
        ResourceObjectPropertyFactoryService]
    };
  }
}
