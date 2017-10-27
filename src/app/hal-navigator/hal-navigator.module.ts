import {ModuleWithProviders, NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {HalDocumentService} from './hal-document/hal-document.service';
import {CollectionResolverService} from './collection/collection-resolver.service';
import {SchemaResolverService} from './schema/schema-resolver.service';
import {ItemResolverService} from './item/item-resolver.service';
import {ItemCacheService} from './item/cache/item-cache.service';
import {MODULE_CONFIG, ModuleConfiguration} from '@hal-navigator/config/module-configuration';

@NgModule({
  imports: [
    HttpModule
  ],
  providers: [
    HalDocumentService,
    CollectionResolverService,
    SchemaResolverService,
    ItemResolverService,
    ItemCacheService
  ]
})
export class HalNavigatorModule {
  static forRoot(configuration: ModuleConfiguration): ModuleWithProviders {
    return {
      ngModule: HalNavigatorModule,
      providers: [{
        provide: MODULE_CONFIG, useValue: configuration
      }]
    };
  }
}
