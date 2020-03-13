import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material';
import {LoginForm} from './login-form';
import {LoginDialogComponent} from './login-dialog.component';

@Injectable({providedIn: 'root'})
export class LoginService {
  private loggedIn = false;

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

  private login() {
    const dialogRef = this.dialog.open(LoginDialogComponent);
    dialogRef.afterClosed().subscribe((loginForm: LoginForm) => {
      if (loginForm && !loginForm.isCancelled()) {
        this.loginRequest(loginForm.getFormData());
      }
    });
  }

  private loginRequest(formData: FormData) {
    this.httpClient.post('/login', formData).subscribe(() => {
      this.loggedIn = true;
    });
  }

  private logout() {
    this.httpClient.post('/logout', null).subscribe(() => {
      this.loggedIn = false;
    });
  }
}
