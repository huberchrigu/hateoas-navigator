import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StaticComponentsModule} from './static-components/static-components.module';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DateTimeType, FormFieldType, HalNavigatorModule, ModuleConfiguration, PropertyConfigBuilder} from 'hateoas-navigator';
import {ResourceComponentsModule} from 'resource-components';
import {QueryConfigBuilder} from 'hateoas-navigator/hal-navigator/config/query-config-builder';

const halNavConfig: ModuleConfiguration = {
  updateMethod: 'PATCH',
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
      .withActionLink('votes', new PropertyConfigBuilder()
        .withProperty('user', {associatedResourceName: 'users', title: 'User'})
        .withProperty('reactionType', {enumOptions: ['APPROVE', 'UNSURE', 'DENY'], title: 'Reaction'})
        .withTitle('Vote')
        .build())
      .withQuery('findByForGroupAndCalendarEntryFromAfterAndCalendarEntryToBefore', new QueryConfigBuilder()
        .withTitle('Find by group and date')
        .withParam('from', {title: 'From', type: FormFieldType.DATE_PICKER})
        .withParam('to', {title: 'To', type: FormFieldType.DATE_PICKER})
        .build())
      .withQuery('getNext', new QueryConfigBuilder()
        .withTitle('Get next suggestions')
        .withParam('numOfWeeks', {title: 'Num. of weeks', type: FormFieldType.INTEGER})
        .build())
      .build()
  }
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    StaticComponentsModule,
    AppRoutingModule,
    ResourceComponentsModule,
    HalNavigatorModule.forRoot(halNavConfig),

    BrowserModule,
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
