import { browser, element, by } from 'protractor';

export class SettyUiPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-setty h1')).getText();
  }
}
