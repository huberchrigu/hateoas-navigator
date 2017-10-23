import * as moment from 'moment';
import {Moment} from 'moment';

/**
 * When parsing a time without timezone, assume UTC. But when formatting, always use the local time.
 * Parsing always happens in strict mode, otherwise values containing any number will be converted to a date/time!
 */
export class DateConverter {
  private static FORMAT_WITH_TIMEZONE = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';
  private static FORMAT_WITHOUT_TIMEZONE = 'YYYY-MM-DDTHH:mm:ss';

  constructor(private format = 'LLL') {
  }

  parseAndFormat(value: any): string {
    return this.parseAndDo(value, (date: Moment) => date.format(this.format));
  }

  parseToDate(value: any): Date {
    return this.parseAndDo(value, (date: Moment) => date.toDate());
  }

  private parseAndDo<T>(value: any, executeOnDate: (date: Moment) => T): T {
    if (value && typeof value === 'string') {
      const date = this.getValidDate(value);
      return date ? executeOnDate(date) : undefined;
    }
    return undefined;
  }

  private getValidDate(value: string) {
    const dateWithTimezone = moment.utc(value, [DateConverter.FORMAT_WITH_TIMEZONE, DateConverter.FORMAT_WITHOUT_TIMEZONE], true);
    return dateWithTimezone.isValid() ? dateWithTimezone.local() : undefined;
  }
}
