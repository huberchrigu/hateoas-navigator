import {StaticPropertyDescriptor} from '@hal-navigator/descriptor/static/static-property-descriptor';
import {DateTimeType, PropertyConfig} from '@hal-navigator/config/module-configuration';

describe('StaticPropertyDescriptor', () => {
  it('should return time option', () => {
    const testee = new StaticPropertyDescriptor('test', {
      properties: {
        child: {
          dateTimeType: DateTimeType.TIME
        } as PropertyConfig
      }
    } as PropertyConfig, {});

    expect(testee.getChild('child').toFormField().options.getDateTimeType()).toEqual(DateTimeType.TIME);
  });
});
