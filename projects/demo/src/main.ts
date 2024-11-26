import {enableProdMode, importProvidersFrom} from '@angular/core';
import {environment} from './environments/environment';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {ResourceComponentsModule} from '../../../libs/resource-components/src/lib';
import {DateTimeType, FormFieldType, HalNavigatorModule, ModuleConfiguration, PropertyConfigBuilder, QueryConfigBuilder} from '../../../libs/hateoas-navigator/src/lib';

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

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {providers: [importProvidersFrom(ResourceComponentsModule.forRoot(), HalNavigatorModule.forRoot(halNavConfig))]})
  .catch(err => console.error(err));
