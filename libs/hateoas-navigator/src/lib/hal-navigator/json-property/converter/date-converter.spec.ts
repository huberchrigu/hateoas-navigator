import {DateConverter} from './date-converter';

describe('DateConverter', () => {
  const testee = new DateConverter();

  it('should not convert a non date or time string', () => {
    expect(testee.parseAndFormat('1 something 2')).toBeUndefined();
    expect(testee.parseAndFormat('1 123 2')).toBeUndefined();
  });

  it('should convert a date', () => {
    const expectedDate = new Date();
    expectedDate.setUTCFullYear(2017, 0, 10);
    expectedDate.setHours(12 + offset(expectedDate), 0, 0, 0);
    expect(testee.parseToDate('2017-01-10T12:00:00.000Z')).toEqual(expectedDate);
  });

  it('should convert a time', () => {
    expect(testee.parseAndFormat('13:00:00')).toEqual((13 + offset(new Date())) + ':00');
  });

  function offset(date: Date) {
    return -date.getTimezoneOffset() / 60;
  }
});
