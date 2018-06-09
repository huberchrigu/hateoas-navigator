import {StaticPropertyDescriptor} from './static-property-descriptor';
import {DateTimeType, PropertyConfig} from '../../config';
import {DatePickerField} from '../../form/date-picker-field';

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
