import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import {LoginData, LoginForm} from './login-form';
import {LoginDialogComponent} from './login-dialog.component';

/**
 * Manages the login state and executes the login and logout.
 * Both are POST requests to /login and /logout, where /login sends the 'username' and 'password' in the body and expects the logged in
 * 'username' in the response's body.
 */
@Injectable({providedIn: 'root'})
export class LoginService {
  private static TOKEN_HEADER = 'X-Auth-Token';
  private username: string;

  private loggedIn = false;
  private token: string;

  constructor(private httpClient: HttpClient, private dialog: MatDialog) {
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  loginOrLogout() {
    if (this.loggedIn) {
      this.logout();
    } else {
      this.login();
    }
  }

  getUserId(): string {
    return this.username;
  }

  addLoginHeader(headers: HttpHeaders) {
    return this.token ? headers.append(LoginService.TOKEN_HEADER, this.token) : headers;
  }

  private login() {
    const dialogRef = this.dialog.open(LoginDialogComponent);
    dialogRef.afterClosed().subscribe((loginForm: LoginForm) => {
      if (loginForm && !loginForm.isCancelled()) {
        this.loginRequest(loginForm.loginData);
      }
    });
  }

  private loginRequest(loginData: LoginData) {
    const body = {
      username: loginData.username,
      password: loginData.password
    };
    this.httpClient.post<any>('/login', body, {observe: 'response'}).subscribe(response => {
      this.token = response.headers.get(LoginService.TOKEN_HEADER);
      this.username = response.body.username;
      this.loggedIn = true;
    });
  }

  private logout() {
    this.httpClient.post('/logout', null).subscribe(() => {
      this.token = undefined;
      this.loggedIn = false;
      this.username = undefined;
    });
  }
}
