import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {DateTimeType, FormFieldType, HalNavigatorModule, ModuleConfiguration, PropertyConfigBuilder, QueryConfigBuilder} from 'hateoas-navigator';
import {AppComponent} from './app.component';
import {StaticComponentsModule} from './static-components/static-components.module';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {ResourceComponentsModule} from 'resource-components';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const halNavConfig: ModuleConfiguration = {
  updateMethod: 'PATCH',
  itemConfigs: {
    meetingGroups: new PropertyConfigBuilder()
      .withProperty('members', new PropertyConfigBuilder()
        .with('isArrayOfAssociations', true)
        .withArrayItems(new PropertyConfigBuilder()
          .with('associatedResourceName', 'users')
          .with('readOnly', false)
          .build())
        .build())
      .withProperty('preferences', new PropertyConfigBuilder()
        .withArrayItems(new PropertyConfigBuilder()
          .withProperty('timeSpan', new PropertyConfigBuilder()
            .withProperty('from', {dateTimeType: DateTimeType.TIME})
            .withProperty('to', {dateTimeType: DateTimeType.TIME})
            .build())
          .build())
        .build())
      .with('permissionDeniedFallback', 'findByMembersCreatedBy?createdBy={userId}')
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
      .with('permissionDeniedFallback', 'findByForGroupMembersCreatedBy?createdBy={userId}')
      .build(),
    users: {permissionDeniedFallback: 'findByCreatedBy?createdBy={userId}'},
    userCalendars: {permissionDeniedFallback: 'findByOwnerCreatedBy?createdBy={userId}'}
  }
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    StaticComponentsModule,
    AppRoutingModule,
    ResourceComponentsModule.forRoot(),
    HalNavigatorModule.forRoot(halNavConfig),

    BrowserModule,
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
