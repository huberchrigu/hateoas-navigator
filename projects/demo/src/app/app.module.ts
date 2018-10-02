import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StaticComponentsModule} from './static-components/static-components.module';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DateTimeType} from 'hateoas-navigator';
import {PropertyConfigBuilder} from 'hateoas-navigator';
import {HalNavigatorModule} from 'hateoas-navigator';
import {DocumentComponentsModule} from 'document-components';

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
            .withArrayItems(new PropertyConfigBuilder()
              .withProperty('timeSpan', new PropertyConfigBuilder()
                .withProperty('from', {dateTimeType: DateTimeType.TIME})
                .withProperty('to', {dateTimeType: DateTimeType.TIME})
                .build())
              .build())
            .build())
          .build(),
        suggestions: new PropertyConfigBuilder()
          .withProperty('userReactions', new PropertyConfigBuilder()
            .withArrayItems(new PropertyConfigBuilder()
              .withProperty('user', {associatedResourceName: 'users'})
              .build())
            .build())
          .build()
      }
    }),

    BrowserModule,
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}