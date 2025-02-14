import {ObjectDescriptorImpl} from './object-descriptor-impl';
import {ResourceObjectDescriptor} from '../../resource-object-descriptor';
import {GenericPropertyDescriptor} from '../../generic-property-descriptor';
import {ResourceActions} from '../../actions';
import {FieldProcessor} from './field-processor';

/**
 * A resource descriptor might know only links OR actions.
 */
export class ResourceDescriptorImpl extends ObjectDescriptorImpl implements ResourceObjectDescriptor {
  constructor(name: string | undefined, title: string | undefined, children: GenericPropertyDescriptor[], private actions: ResourceActions | undefined,
              private linkFunction: (uri: string) => ResourceObjectDescriptor, fieldProcessor: FieldProcessor) {
    super(name, title, children, fieldProcessor);
    if (!linkFunction && !actions) {
      throw new Error('Not a valid resource');
    }
  }

  getActions(): ResourceActions {
    return this.actions!;
  }

  getDescriptorForLink(uri: string): ResourceObjectDescriptor | undefined {
    return this.linkFunction ? this.linkFunction(uri) : undefined;
  }
}
