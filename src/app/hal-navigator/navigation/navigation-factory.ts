import {NavigationItem} from './navigation-item';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';
import {LinkFactory} from '@hal-navigator/link-object/link-factory';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/forkJoin';

export class NavigationFactory {

  constructor(private resourceObject: ResourceObjectAdapter) {
  }

  getItems(): Observable<Array<NavigationItem>> {
    return Observable.forkJoin(...this.resourceObject.getLinks()
      .filter(link => link.getRelationType() !== LinkFactory.PROFILE_RELATION_TYPE)
      .map(link => link.getResourceDescriptor()
        .map(descriptor => new NavigationItem(link.getRelativeUriWithoutTemplatedPart(), descriptor.getTitle()))));
  }
}
