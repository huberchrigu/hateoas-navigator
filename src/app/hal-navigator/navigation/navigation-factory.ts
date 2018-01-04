import {NavigationItem} from './navigation-item';
import {ResourceAdapter} from '@hal-navigator/hal-resource/resource-adapter';
import {LinkFactory} from '@hal-navigator/link-object/link-factory';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/forkJoin';

export class NavigationFactory {

  constructor(private resourceObject: ResourceAdapter) {
  }

  getItems(): Observable<Array<NavigationItem>> {
    return Observable.forkJoin(...this.resourceObject.getLinks()
      .filter(link => link.getRelationType() !== LinkFactory.PROFILE_RELATION_TYPE)
      .map(link => link.getResourceDescriptor()
        .map(descriptor => new NavigationItem(link.getRelativeUriWithoutTemplatedPart(), descriptor.getTitle()))));
  }
}
