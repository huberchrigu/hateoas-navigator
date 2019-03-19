import {map} from 'rxjs/operators';
import {NavigationItem} from './navigation-item';
import {LinkFactory} from '../link-object/link-factory';
import {forkJoin, Observable} from 'rxjs';
import {JsonResourceObject} from '../hal-resource/resource-object';

export class NavigationFactory {

  constructor(private resourceObject: JsonResourceObject) {
  }

  getItems(): Observable<Array<NavigationItem>> {
    return forkJoin(...this.resourceObject.getLinks()
      .filter(link => link.getRelationType() !== LinkFactory.PROFILE_RELATION_TYPE)
      .map(link => link.getResourceDescriptor().pipe(
        map(descriptor => new NavigationItem(link.getRelativeUriWithoutTemplatedPart(), descriptor.getTitle())))));
  }
}
