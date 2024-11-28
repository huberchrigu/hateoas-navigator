import moment from 'moment';
import {Moment} from 'moment';

/**
 * When parsing a time without timezone, assume UTC. But when formatting, always use the local time.
 * Parsing always happens in strict mode, otherwise values containing any number will be converted to a date/time!
 */
export class DateConverter {
  private static DATE_FORMATS = ['YYYY-MM-DDTHH:mm:ss.SSSZZ', 'YYYY-MM-DDTHH:mm:ss'];
  private static TIME_FORMATS = ['HH:mm:ssZZ', 'HH:mm:ss', 'HH:mmZZ', 'HH:mm'];

  constructor(private format = 'LLL') {
  }

  parseAndFormat(value: any): string | undefined {
    return this.parseAndDo(value, (date: Moment) => date.format(this.format), time => time.format('HH:mm'));
  }

  parseToDate(value: any): Date | undefined {
    return this.parseAndDo(value, (date: Moment) => date.toDate(), date => date.toDate());
  }

  private parseAndDo<T>(value: any, executeOnDate: (date: Moment) => T, executeOnTime: (date: Moment) => T): T | undefined {
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

  private getValidDate(value: string): moment.Moment | undefined {
    const dateWithTimezone = moment.utc(value, DateConverter.DATE_FORMATS, true);
    return dateWithTimezone.isValid() ? dateWithTimezone.local() : undefined;
  }

  private getValidTime(value: string): moment.Moment | undefined {
    const time = moment.utc(value, DateConverter.TIME_FORMATS, true);
    return time.isValid() ? time.local() : undefined;
  }
}
