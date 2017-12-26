import {HttpHeaders} from '@angular/common/http';

export class HeaderOptions {
  private static ACCEPT_HEADER = 'Accept';
  private static IF_NONE_MATCH_HEADER = 'If-None-Match';
  private static IF_MATCH_HEADER = 'If-Match';

  static withAcceptHeader(acceptHeader: string) {
    return HeaderOptions.withHeader(HeaderOptions.ACCEPT_HEADER, acceptHeader);
  }

  static withIfNoneMatchHeader(ifNoneMatchHeader: string) {
    return HeaderOptions.withHeader(HeaderOptions.IF_NONE_MATCH_HEADER, ifNoneMatchHeader);
  }

  static withIfMatchHeader(ifMatchHeader: string) {
    return HeaderOptions.withHeader(HeaderOptions.IF_MATCH_HEADER, ifMatchHeader);
  }

  private static withHeader(header: string, value: string): HttpHeaders {
    return new HttpHeaders().set(header, value);
  }
}
