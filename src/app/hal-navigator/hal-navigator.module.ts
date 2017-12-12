import {ModuleWithProviders, NgModule} from '@angular/core';
import {HalDocumentService} from './resource-services/hal-document.service';
import {CollectionResolverService} from './collection/collection-resolver.service';
import {SchemaResolverService} from './schema/schema-resolver.service';
import {ItemResolverService} from './item/item-resolver.service';
import {ItemCacheService} from './item/cache/item-cache.service';
import {MODULE_CONFIG, ModuleConfiguration} from '@hal-navigator/config/module-configuration';
import {HttpClientModule} from '@angular/common/http';
import {ResourceDescriptorResolver} from '@hal-navigator/descriptor/resource-descriptor-resolver';
import {DefaultDescriptorResolver} from '@hal-navigator/descriptor/default-descriptor-resolver';
import {SchemaService} from '@hal-navigator/resource-services/schema.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    HalDocumentService,
    CollectionResolverService,
    SchemaResolverService,
    ItemResolverService,
    ItemCacheService,
    SchemaService
  ]
})
export class HalNavigatorModule {
  static forRoot(configuration: ModuleConfiguration,
                 descriptorResolverFactory?: () => ResourceDescriptorResolver,
                 descriptorResolverDeps?: any[]): ModuleWithProviders {
    const factory = descriptorResolverFactory ? descriptorResolverFactory :
      (schemaService: SchemaService) => new DefaultDescriptorResolver(configuration, schemaService);
    const deps = descriptorResolverDeps ? descriptorResolverDeps : [SchemaService];
    return {
      ngModule: HalNavigatorModule,
      providers: [{
        provide: MODULE_CONFIG, useValue: configuration
      }, {
        provide: ResourceDescriptorResolver, useFactory: factory, deps: deps
      }]
    };
  }
}
