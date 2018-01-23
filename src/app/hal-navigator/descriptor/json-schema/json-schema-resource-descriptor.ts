import {JsonSchemaDescriptor} from '@hal-navigator/descriptor/json-schema/json-schema-descriptor';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {ResourceActions} from '@hal-navigator/descriptor/actions/resource-actions';


export class JsonSchemaResourceDescriptor extends JsonSchemaDescriptor implements ResourceDescriptor {
  getActions(): ResourceActions {
    return undefined;
  }

  getChildResourceDesc(childResource: string): ResourceDescriptor {
    const child = this.getProperties()[childResource];
    return child ? new JsonSchemaResourceDescriptor(childResource, child, this, this.schemaReferenceFactory) : null;
  }
}
