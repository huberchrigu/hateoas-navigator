import {map} from 'rxjs/operators';
import {NavigationItem} from './navigation-item';
import {LinkFactory} from '../link-object/link-factory';
import {forkJoin, Observable} from 'rxjs';
import {ResourceObjectProperty} from '../hal-resource/resource-object-property';
import {ResourceLink} from '../link-object/resource-link';

export class NavigationFactory {

  constructor(private resourceObject: ResourceObjectProperty) {
  }

  getItems(): Observable<Array<NavigationItem>> {
    return forkJoin(this.resourceObject.getLinks()
      .filter(link => link.getRelationType() !== LinkFactory.PROFILE_RELATION_TYPE)
      .map(link => this.toNavigationItem(link)));
  }

  private toNavigationItem(link: ResourceLink) {
    return link.getResourceDescriptor().pipe(
      map(descriptor => new NavigationItem(link.toRelativeLink().getUri(), descriptor.getTitle()))
    );
  }
}
