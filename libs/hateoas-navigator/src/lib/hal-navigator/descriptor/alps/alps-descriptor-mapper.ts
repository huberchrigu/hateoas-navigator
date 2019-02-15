import {AlpsDescriptor} from '../../alps-document/alps-descriptor';
import {AlpsDescriptorAdapter} from '../../alps-document/alps-descriptor-adapter';
import {FormFieldBuilder} from '../../form/form-field-builder';
import {ResourceActions} from '../actions/resource-actions';
import {ResourceAction} from '../actions/resource-action';
import {Required, Validate} from '../../../decorators/required';
import {ActionType} from '../actions/action-type';
import {DescriptorMapper} from 'hateoas-navigator/hal-navigator/descriptor/mapper/descriptor-mapper';
import {DescriptorBuilder} from 'hateoas-navigator/hal-navigator/descriptor/mapper/descriptor-builder';

export class AlpsDescriptorMapper extends DescriptorMapper<AlpsDescriptor> {
  private static readonly REPRESENTATION_PREFIX = '-representation';

  private readonly actions: ResourceActions;
  private readonly name: string;

  constructor(private alps: AlpsDescriptor, private allDescriptors: AlpsDescriptor[]) {
    super();
    this.name = AlpsDescriptorMapper.extractName(alps);
    this.actions = this.toActions(allDescriptors);
  }

  map(builder: DescriptorBuilder<AlpsDescriptor>) {
    builder.withName(this.name)
      .withActions(this.actions)
      .withChildren(this.getChildren())
      .withArrayItems(this.getArrayItems())
      .withAssociation(this.getAssociatedResourceName())
      .withBuilder(alps => new AlpsDescriptorMapper(alps, this.allDescriptors));
  }

  getChildren(): Array<AlpsDescriptor> {
    return this.alps.descriptor;
  }

  /**
   * Example:
   * {name: 'members', rt: 'http://...'} can be the output for a field 'members' that is actually an array.
   *
   * That is why the {@link FormFieldBuilder} cannot resolve the array descriptors immediately, otherwise this would
   * end in an endless loop.
   */
  getArrayItems(): AlpsDescriptor {
    // return this.alps; // TODO
    return undefined;
  }

  getAssociatedResourceName(): string {
    if (this.alps.rt) {
      return new AlpsDescriptorAdapter(this.alps).getCollectionResourceName();
    }
    return null;
  }

  getActions(): ResourceActions {
    return this.actions;
  }

  private static extractName(alps: AlpsDescriptor) {
    return alps.name ||
      (alps.id.endsWith(AlpsDescriptorMapper.REPRESENTATION_PREFIX) ?
          alps.id.substring(0, alps.id.length - AlpsDescriptorMapper.REPRESENTATION_PREFIX.length) :
          undefined
      );
  }

  private toActions(descriptors: AlpsDescriptor[]) {
    const actions: Array<ResourceAction> = [];
    const resourceName = this.name;
    const descriptorIds = descriptors.map(d => d.id);
    descriptorIds
      .filter(id => id)
      .forEach(id => {
        const action = this.toAction(id, resourceName);
        if (action) {
          actions.push(action);
        }
      });
    return new ResourceActions(actions);
  }

  @Validate
  private toAction(@Required descriptorId: string, resourceName: string) {
    switch (descriptorId) {
      case 'get-' + resourceName:
        return new ResourceAction(ActionType.GET_ITEM, true);
      case 'delete-' + resourceName:
        return new ResourceAction(ActionType.DELETE_ITEM, true);
      case 'update-' + resourceName:
        return new ResourceAction(ActionType.UPDATE_ITEM, true);
    }
    if (descriptorId.startsWith('get-' + resourceName)) {
      return new ResourceAction(ActionType.GET_COLLECTION, true);
    }
    if (descriptorId.startsWith('create-' + resourceName)) {
      return new ResourceAction(ActionType.CREATE_ITEM, true);
    }
    return null;
  }
}
