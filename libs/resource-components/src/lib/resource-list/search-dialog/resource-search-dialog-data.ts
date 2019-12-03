import {ResourceDescriptor, ResourceLink} from 'hateoas-navigator';

export class ResourceSearchDialogData {
  constructor(public urls: ResourceLink[], public descriptor: ResourceDescriptor) {

  }

}
