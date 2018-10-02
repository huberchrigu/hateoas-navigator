import {ModuleWithProviders, NgModule} from '@angular/core';
import {HalDocumentService} from './resource-services/hal-document.service';
import {CollectionResolverService} from './collection/collection-resolver.service';
import {ResourceObjectResolverService} from './item/resource-object-resolver.service';
import {ItemCacheService} from './item/cache/item-cache.service';
import {MODULE_CONFIG, ModuleConfiguration} from './config/module-configuration';
import {HttpClientModule} from '@angular/common/http';
import {ResourceDescriptorProvider} from './descriptor/provider/resource-descriptor-provider';
import {DefaultDescriptorProvider} from './descriptor/provider/default-descriptor-provider';
import {SchemaService} from './resource-services/schema.service';
import {ResourceDescriptorResolverService} from './descriptor/resolver/resource-descriptor-resolver.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    HalDocumentService,
    CollectionResolverService,
    ResourceDescriptorResolverService,
    ResourceObjectResolverService,
    ItemCacheService,
    SchemaService
  ]
})
export class HalNavigatorModule {
  static forRoot(configuration: ModuleConfiguration,
                 descriptorResolverFactory?: () => ResourceDescriptorProvider,
                 descriptorResolverDeps?: any[]): ModuleWithProviders {
    const factory = descriptorResolverFactory ? descriptorResolverFactory :
      (schemaService: SchemaService) => new DefaultDescriptorProvider(configuration, schemaService);
    const deps = descriptorResolverDeps ? descriptorResolverDeps : [SchemaService];
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