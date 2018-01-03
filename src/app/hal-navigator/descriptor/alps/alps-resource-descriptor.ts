import {ResourceDescriptor} from 'app/hal-navigator/descriptor/resource-descriptor';
import {AlpsDescriptor} from 'app/hal-navigator/alp-document/alps-descriptor';
import {SchemaService} from 'app/hal-navigator/resource-services/schema.service';
import {Observable} from 'rxjs/Observable';
import {AlpsDescriptorAdapter} from 'app/hal-navigator/alp-document/alps-descriptor-adapter';
import {AssociatedResourceResolver} from 'app/hal-navigator/descriptor/association/associated-resource-resolver';
import {AssociatedResourceListener} from 'app/hal-navigator/descriptor/association/associated-resource-listener';
import {FormField} from 'app/hal-navigator/schema/form/form-field';
import {AlpsFormField} from '@hal-navigator/descriptor/alps/alps-form-field';

export class AlpsResourceDescriptor extends AssociatedResourceListener implements ResourceDescriptor, AssociatedResourceResolver {
  private associatedDescriptor: AlpsResourceDescriptor;
  private children: {[name: string]: AlpsResourceDescriptor} = {};

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
    return this.resolveChild(resourceName);
  }

  getChildren(): Array<ResourceDescriptor> {
    if (!this.alps.descriptors) {
      return [];
    }
    return this.alps.descriptors.map(d => this.resolveChild(d.name));
  }

  resolveAssociation(): Observable<ResourceDescriptor> {
    if (!this.alps.rt) {
      return null;
    }
    return this.schemaService.getAlps(this.getAssociatedResourceName()).map(a => {
      this.associatedDescriptor = new AlpsResourceDescriptor(a.getRepresentationDescriptor().descriptor, this.schemaService);
      return this.associatedDescriptor;
    });
  }

  getAssociatedResource(): ResourceDescriptor {
    if (this.alps.rt && !this.associatedDescriptor) {
      throw new Error('Associated ALPS descriptor was not resolved yet');
    }
    return this.associatedDescriptor;
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
    return new AlpsFormField(this);
  }

  private resolveChild(resourceName: string) {
    const fromCache = this.children[resourceName];
    if (fromCache) {
      return fromCache;
    }
    if (this.alps.rt) {
      return this.getAssociatedResource().getChild(resourceName);
    }
    if (!this.alps.descriptors) {
      return null;
    }
    const descriptor = this.alps.descriptors.find(d => d.name === resourceName);
    if (descriptor) {
      const newDescriptor = new AlpsResourceDescriptor(descriptor, this.schemaService);
      this.children[resourceName] = newDescriptor;
      return newDescriptor;
    }
    return null;
  }
}
