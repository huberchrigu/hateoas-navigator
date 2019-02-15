import {JsonSchemaDescriptor} from './json-schema-descriptor';
import {DeprecatedResourceDescriptor} from '../deprecated-resource-descriptor';
import {ResourceActions} from '../actions/resource-actions';

export class JsonSchemaResourceDescriptor extends JsonSchemaDescriptor implements DeprecatedResourceDescriptor {
  getActions(): ResourceActions {
    return undefined;
  }

  getDescriptorForLink(uri: string): DeprecatedResourceDescriptor {
    return undefined;
  }
}
