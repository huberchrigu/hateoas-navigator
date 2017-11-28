import {NavigationItem} from './navigation-item';
import {ResourceObjectAdapter} from '@hal-navigator/resource-object/resource-object-adapter';
import {LinkFactory} from '@hal-navigator/link-object/link-factory';

export class NavigationFactory {

  constructor(private resourceObject: ResourceObjectAdapter) {
  }

  getItems(): Array<NavigationItem> {
    return this.resourceObject.getLinks()
      .filter(link => link.getRelationType() !== LinkFactory.PROFILE_RELATION_TYPE)
      .map(link => new NavigationItem(link.getRelationType(), link.getFullUri()));
  }
}
