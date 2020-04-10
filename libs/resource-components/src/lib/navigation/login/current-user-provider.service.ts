import {CurrentUserProvider} from 'hateoas-navigator';
import {LoginService} from './login.service';
import {Injectable} from '@angular/core';

/**
 * Provides the current user from the {@link LoginService}.
 */
@Injectable()
export class CurrentUserProviderService extends CurrentUserProvider {
  constructor(private loginService: LoginService) {
    super();
  }

  getUserId(): string {
    return this.loginService.getUserId();
  }
}
