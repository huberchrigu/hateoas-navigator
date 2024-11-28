export class LoginDialogResult {
  constructor(public loginData: LoginData | null) {
  }

  isCancelled() {
    return !this.loginData;
  }
}

export interface LoginData {
  username: string;
  password: string;
}
