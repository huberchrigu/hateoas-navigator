import {DateTimeType, PropertyConfig} from '../../config';
import {DatePickerField} from '../../form/date-picker-field';
import {StaticDescriptorMapper} from './static-descriptor-mapper';
import {ObjectDescriptor} from '../generic-property-descriptor';

describe('StaticDescriptorMapper', () => {
  it('should return time option', () => {
    const testee = new StaticDescriptorMapper('test', {
        properties: {
            child: {
                dateTimeType: DateTimeType.TIME
            } as PropertyConfig
        }
    } as PropertyConfig, {}).toDescriptor() as ObjectDescriptor;

    const child = testee.getChildDescriptor('child').toFormFieldBuilder().build() as DatePickerField;
    expect(child.getDateTimeType()).toEqual(DateTimeType.TIME);
  });
});
