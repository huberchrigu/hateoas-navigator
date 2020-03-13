export class LoginForm {
  constructor(private loginData: LoginData) {
  }

  isCancelled() {
    return !this.loginData;
  }

  getFormData() {
    const formData = new FormData();
    formData.append('username', this.loginData.username);
    formData.append('password', this.loginData.password);
    return formData;
  }
}

export interface LoginData {
  username: string;
  password: string;
}
