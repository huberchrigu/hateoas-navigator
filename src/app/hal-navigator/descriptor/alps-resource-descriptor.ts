import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {AlpsDescriptor} from '@hal-navigator/alp-document/alps-descriptor';
import {SchemaService} from '@hal-navigator/resource-services/schema.service';
import {Observable} from 'rxjs/Observable';
import {AlpsDescriptorAdapter} from '@hal-navigator/alp-document/alps-descriptor-adapter';
import {AssociatedResourceResolver} from '@hal-navigator/descriptor/association/associated-resource-resolver';
import {AssociatedResourceListener} from '@hal-navigator/descriptor/association/associated-resource-listener';
import {FormField} from '@hal-navigator/schema/form/form-field';

export class AlpsResourceDescriptor extends AssociatedResourceListener implements ResourceDescriptor, AssociatedResourceResolver {
  private associatedDescriptor: AlpsDescriptorAdapter;

  constructor(private alps: AlpsDescriptor, private schemaService: SchemaService) {
    super();
  }

  getTitle(): string {
    return undefined;
  }

  getName(): string {
    return this.alps.name;
  }

  getChild(resourceName: string): ResourceDescriptor {
    if (!this.alps.descriptors) {
      return null;
    }
    const descriptor = this.alps.descriptors.find(d => d.name === resourceName);
    return descriptor ? new AlpsResourceDescriptor(descriptor, this.schemaService) : null;
  }

  getChildren(): Array<ResourceDescriptor> {
    if (!this.alps.descriptors) {
      return [];
    }
    return this.alps.descriptors.map(d => new AlpsResourceDescriptor(d, this.schemaService));
  }

  resolveAssociation(): Observable<ResourceDescriptor> {
    if (!this.alps.rt) {
      return null;
    }
    return this.schemaService.getAlps(this.getAssociatedResourceName()).map(a => {
      this.associatedDescriptor = a.getRepresentationDescriptor();
      return new AlpsResourceDescriptor(a.getRepresentationDescriptor().descriptor, this.schemaService);
    });
  }

  resolveAssociatedResourceName(): string {
    if (this.alps.rt) {
      return new AlpsDescriptorAdapter(this.alps).getCollectionResourceName();
    }
    return null;
  }

  getAlpsDescriptor() {
    return this.alps;
  }

  toFormField(): FormField {
    return undefined;
  }
}
