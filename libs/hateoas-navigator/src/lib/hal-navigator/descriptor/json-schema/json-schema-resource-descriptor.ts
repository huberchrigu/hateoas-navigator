import {JsonSchemaDescriptor} from './json-schema-descriptor';
import {ResourceDescriptor} from '../resource-descriptor';
import {ResourceActions} from '../actions/resource-actions';

export class JsonSchemaResourceDescriptor extends JsonSchemaDescriptor implements ResourceDescriptor {
  getActions(): ResourceActions {
    return undefined;
  }

  getChildResourceDesc(childResource: string): ResourceDescriptor {
    const child = this.getProperties()[childResource];
    return child ? new JsonSchemaResourceDescriptor(childResource, child, this, this.schemaReferenceFactory) : null;
  }
}
