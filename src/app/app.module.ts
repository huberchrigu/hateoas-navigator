import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StaticComponentsModule} from './static-components/static-components.module';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DocumentComponentsModule} from '@document-components/document-components.module';
import {HalNavigatorModule} from '@hal-navigator/hal-navigator.module';
import {DateTimeType} from '@hal-navigator/config/module-configuration';
import {PropertyConfigBuilder} from '@hal-navigator/config/property-config-builder';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    StaticComponentsModule,
    AppRoutingModule,
    DocumentComponentsModule,
    HalNavigatorModule.forRoot({
      itemConfigs: {
        meetingGroups: new PropertyConfigBuilder()
          .withProperty('preferences', new PropertyConfigBuilder()
            .withProperty('timeSpan', new PropertyConfigBuilder()
              .withProperty('from', {dateTimeType: DateTimeType.TIME})
              .withProperty('to', {dateTimeType: DateTimeType.TIME})
              .build())
            .build())
      }
    }),

    BrowserModule,
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
