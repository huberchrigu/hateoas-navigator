export class LoginDialogResult {
  constructor(public loginData: LoginData) {
  }

  isCancelled() {
    return !this.loginData;
  }
}

export interface LoginData {
  username: string;
  password: string;
}
