import {HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {CollectionAdapter} from '../collection';
import {CurrentUserProvider} from './current-user-provider';
import {ModuleConfiguration, PropertyConfig} from '../config';

/**
 * Allows fetching another endpoint if the user has no permission to get all items of a resource.
 * See also {@link PropertyConfig.permissionDeniedFallback} and {@link PropertyConfig.unauthorizedFallback}.
 */
export class GetCollectionFallback {
  private static USER_ID_PLACEHOLDER = '{userId}';
  private static IGNORE_ERRORS_HEADER = 'X-Ignore-Errors';

  private readonly itemConfig!: PropertyConfig;

  constructor(private resourceName: string, config: ModuleConfiguration,
              private retryRequest: (uri: string) => Observable<CollectionAdapter>,
              private currentUserProvider?: CurrentUserProvider) {
    if (config && config.itemConfigs) {
      this.itemConfig = config.itemConfigs[resourceName];
    }
  }

  /**
   * Parses the X-Ignore-Errors header and returns the response codes that will be handled by this fallback.
   */
  static getIgnoredErrorsFromRequest(req: HttpRequest<any>): number[] {
    const header = req.headers.get(GetCollectionFallback.IGNORE_ERRORS_HEADER);
    if (header) {
      return header.split(',').map(value => +value);
    }
    return [];
  }

  /**
   * Applies the fallback query request, if possible. The according fallback search URI must be configured in the {@link PropertyConfig}.
   */
  handleError(response: HttpResponse<any>): Observable<CollectionAdapter> {
    const code = response.status;
    let searchUri: string | undefined;
    if (this.itemConfig) {
      switch (code) {
        case 401:
          searchUri = this.itemConfig.unauthorizedFallback;
          break;
        case 403:
          searchUri = this.itemConfig.permissionDeniedFallback;
          break;
      }
    }
    if (searchUri) {
      return this.getCollectionFromSearchUri(searchUri);
    }
    return throwError(response);
  }

  /**
   * Sets the X-Ignore-Errors header with the response codes that will trigger the fallback query request.
   */
  getFallbackHeaders() {
    if (this.itemConfig) {
      const header = [];
      if (this.itemConfig.unauthorizedFallback) {
        header.push(401);
      }
      if (this.itemConfig.permissionDeniedFallback) {
        header.push(403);
      }
      if (header.length > 0) {
        return new HttpHeaders().append(GetCollectionFallback.IGNORE_ERRORS_HEADER, header.join(','));
      }
    }
    return undefined;
  }

  private getCollectionFromSearchUri(searchUri: string): Observable<CollectionAdapter> {
    if (searchUri.indexOf(GetCollectionFallback.USER_ID_PLACEHOLDER) > -1) {
      const currentUser = this.currentUserProvider ? this.currentUserProvider.getUserId() : null;
      if (currentUser) {
        searchUri = searchUri.replace(GetCollectionFallback.USER_ID_PLACEHOLDER, currentUser);
      } else {
        throw Error('Please provide an implementation of the CurrentUserProvider');
      }
    }
    return this.retryRequest('/' + this.resourceName + '/search/' + searchUri);
  }
}
