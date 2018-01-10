import {StaticPropertyDescriptor} from '@hal-navigator/descriptor/static/static-property-descriptor';
import {DateTimeType, PropertyConfig} from '@hal-navigator/config/module-configuration';
import {DatePickerField} from '@hal-navigator/form/date-picker-field';

describe('StaticPropertyDescriptor', () => {
  it('should return time option', () => {
    const testee = new StaticPropertyDescriptor('test', {
      properties: {
        child: {
          dateTimeType: DateTimeType.TIME
        } as PropertyConfig
      }
    } as PropertyConfig, {});

    const child = testee.getChildDescriptor('child').toFormFieldBuilder().build() as DatePickerField;
    expect(child.getDateTimeType()).toEqual(DateTimeType.TIME);
  });
});
