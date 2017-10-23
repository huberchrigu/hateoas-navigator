import {HeaderOptions} from '@hal-navigator/http/http/header-options';

describe('HeaderOptions', () => {

  it('should create a "If-Match"" header', () => {
    const expectedHeader = '"1"';
    const testee = HeaderOptions.withIfMatchHeader(expectedHeader);

    expect(testee.headers.keys().length).toEqual(1);
    expect(testee.headers.get('If-Match')).toEqual(expectedHeader);
  });
});
