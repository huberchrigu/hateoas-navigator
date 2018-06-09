import {HeaderOptions} from './header-options';

describe('HeaderOptions', () => {

  it('should create a "If-Match"" header', () => {
    const expectedHeader = '"1"';
    const testee = HeaderOptions.withIfMatchHeader(expectedHeader);

    expect(testee.keys().length).toEqual(1);
    expect(testee.get('If-Match')).toEqual(expectedHeader);
  });
});
