import {ResourceObjectDescriptor, ResourceLink} from 'hateoas-navigator';

export class ResourceSearchDialogData {
  constructor(public urls: ResourceLink[], public descriptor: ResourceObjectDescriptor) {

  }

}
