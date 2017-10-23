import {ResourceLinks} from './resource-links';
import {EmbeddedResources} from '@hal-navigator/resource-object/embedded-resources';

export interface ResourceObject {
  [propertyName: string]: any;

  _embedded: EmbeddedResources;
  _links: ResourceLinks;
}
