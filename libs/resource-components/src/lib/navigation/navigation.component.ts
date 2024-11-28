import {Component, Input, OnInit} from '@angular/core';
import {NavigationItem, ResourceService} from 'hateoas-navigator';
import {flatMap} from 'rxjs/operators';
import {LoginService} from './login';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink} from '@angular/router';
import {MatAnchor, MatIconButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'lib-navigation',
  templateUrl: './navigation.component.html',
  imports: [
    MatIcon,
    MatToolbar,
    RouterLink,
    MatIconButton,
    MatAnchor,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements OnInit {
  items!: Array<NavigationItem>;

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

  getUserName() {
    return this.loginService.getUserId();
  }
}
