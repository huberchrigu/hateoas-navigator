import {SettyUiPage} from './app.po';

describe('setty-ui App', () => {
  let page: SettyUiPage;

  beforeEach(() => {
    page = new SettyUiPage();
  });

  it('should display message saying app works', async () => {
    page.navigateTo();
    expect<any>(page.getParagraphText()).toEqual('app works!');
  });
});
