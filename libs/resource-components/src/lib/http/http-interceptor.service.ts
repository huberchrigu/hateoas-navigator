import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MessageService} from '../message-dialog/message.service';
import {LoginService} from '../navigation/login/login.service';
import {GetCollectionFallback} from 'hateoas-navigator/hal-navigator/resource-services/get-collection-fallback';

/**
 * An {@link HttpInterceptor} that
 * <ul>
 *   <li>adds the X-Auth-Token header from the {@link LoginService}</li>
 *   <li>handles all error codes 4xx and 5xx, except for the ones in the {@link GetCollectionFallback X-Ignore-Errors header}</li>
 * </ul>
 *
 * An error is shown as simple {@link MessageService message}.
 */
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private messageService: MessageService, private loginService: LoginService) {
  }

  private static getTitle(error: HttpResponse<any>) {
    const status = error.status;
    switch (status) {
      case 401:
        return 'Permission denied';
      case 403:
        return 'Permission denied';
      default:
        return 'Unknown error';
    }
  }

  private static getText(error: HttpResponse<any>) {
    const status = error.status;
    switch (status) {
      case 401:
        return 'Please login';
      case 403:
        return 'You do not seem to have the permission to execute this operation';
      default:
        return 'Please contact support';
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = this.loginService.addLoginHeader(req.headers);
    const withTokenHeader = req.clone({headers});
    const ignore = GetCollectionFallback.getIgnoredErrorsFromRequest(req);
    return next.handle(withTokenHeader).pipe(
      catchError(error => {
        if (error.status >= 400 && error.status < 600 && !ignore.some(i => i === error.status)) {
          this.messageService.openMessageDialog({
            title: HttpInterceptorService.getTitle(error),
            text: HttpInterceptorService.getText(error)
          });
        }
        return throwError(error);
      })
    );
  }
}
