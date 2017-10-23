import {Injectable} from '@angular/core';
import {ItemAdapter} from '@hal-navigator/item/item-adapter';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HalDocumentService} from '@hal-navigator/hal-document/hal-document.service';
import {Observable} from 'rxjs/Observable';
import {RouteParams} from '@hal-navigator/routing/route-params';

@Injectable()
export class ItemResolverService implements Resolve<ItemAdapter> {

  constructor(private halDocumentService: HalDocumentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ItemAdapter> | Promise<ItemAdapter> | ItemAdapter {
    return this.halDocumentService.getItem(route.params[RouteParams.RESOURCE_PARAM], route.params[RouteParams.ID_PARAM]);
  }

}
