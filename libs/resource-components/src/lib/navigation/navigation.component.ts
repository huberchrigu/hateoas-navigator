import {Component, Input, OnInit} from '@angular/core';
import {ResourceService} from 'hateoas-navigator';
import {NavigationItem} from 'hateoas-navigator';
import {flatMap} from 'rxjs/operators';
import {LoginService} from './login/login.service';

@Component({
  selector: 'lib-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements OnInit {
  items: Array<NavigationItem>;

  @Input()
  enableLogin = false;

  constructor(private halDocumentService: ResourceService, private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.halDocumentService.getRootNavigation()
      .pipe(flatMap(navigation => navigation.getItems()))
      .subscribe(items => this.items = items);
  }

  getLoginIcon() {
    return this.loginService.isLoggedIn() ? 'lock_open' : 'lock';
  }

  loginOrLogout() {
    this.loginService.loginOrLogout();
  }
}
