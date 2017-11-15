import * as moment from 'moment';
import {Moment} from 'moment';

/**
 * When parsing a time without timezone, assume UTC. But when formatting, always use the local time.
 * Parsing always happens in strict mode, otherwise values containing any number will be converted to a date/time!
 */
export class DateConverter {
  private static FORMAT_WITH_TIMEZONE = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';
  private static FORMAT_WITHOUT_TIMEZONE = 'YYYY-MM-DDTHH:mm:ss';
  private static TIME_FORMAT = 'HH:mm:ss';

  constructor(private format = 'LLL') {
  }

  parseAndFormat(value: any): string {
    return this.parseAndDo(value, (date: Moment) => date.format(this.format), time => time.format('HH:mm'));
  }

  parseToDate(value: any): Date {
    return this.parseAndDo(value, (date: Moment) => date.toDate(), date => date.toDate());
  }

  private parseAndDo<T>(value: any, executeOnDate: (date: Moment) => T, executeOnTime: (date: Moment) => T): T {
    if (value && typeof value === 'string') {
      const date = this.getValidDate(value);
      if (date) {
        return executeOnDate(date);
      }
      const time = this.getValidTime(value);
      if (time) {
        return executeOnTime(time);
      }
    }
    return undefined;
  }

  private getValidDate(value: string) {
    const dateWithTimezone = moment.utc(value, [DateConverter.FORMAT_WITH_TIMEZONE, DateConverter.FORMAT_WITHOUT_TIMEZONE], true);
    return dateWithTimezone.isValid() ? dateWithTimezone.local() : undefined;
  }

  private getValidTime(value: string) {
    const time = moment.utc(value, DateConverter.TIME_FORMAT, true);
    return time.isValid() ? time.local() : undefined;
  }
}
