import {AlpsDescriptor} from '../../alps-document/alps-descriptor';
import {AlpsDescriptorAdapter} from '../../alps-document/alps-descriptor-adapter';
import {ResourceActions} from '../actions/resource-actions';
import {ResourceAction} from '../actions/resource-action';
import {Required, Validate} from '../../../decorators/required';
import {ActionType} from '../actions/action-type';
import {DescriptorMapper} from '../mapper/descriptor-mapper';
import {DescriptorBuilder} from '../mapper/descriptor-builder';
import {DescriptorType} from '../mapper/internal/descriptor-type';

export class AlpsDescriptorMapper extends DescriptorMapper<AlpsDescriptor> {
  private static readonly REPRESENTATION_PREFIX = '-representation';

  private readonly name: string;

  private static guessType(children: Array<AlpsDescriptor>, actions: ResourceActions, associatedResourceName: string): DescriptorType {
    if (associatedResourceName) {
      return 'association';
    } else if (children) {
      if (actions) {
        return 'resource';
      } else {
        return 'object';
      }
    }
    return undefined;
  }

  /**
   * Only root resource has actions, therefore _allDescriptors_ should be empty for all children.
   */
  constructor(private alps: AlpsDescriptor, private allDescriptors: AlpsDescriptor[]) {
    super();
    this.name = this.extractName();
  }

  map(builder: DescriptorBuilder<AlpsDescriptor>) {
    const children = this.getChildren();
    const actions = this.toActions();
    const associatedResourceName = this.getAssociatedResourceName();
    builder.withName(this.name)
      .withType(AlpsDescriptorMapper.guessType(children, actions, associatedResourceName))
      .withActions(actions)
      .withChildren(children)
      .withArrayItems(this.getArrayItems())
      .withAssociation(associatedResourceName)
      .withBuilder(alps => new AlpsDescriptorMapper(alps, []));
  }

  private extractName() {
    return this.alps.name ||
      (this.alps.id.endsWith(AlpsDescriptorMapper.REPRESENTATION_PREFIX) ?
          this.alps.id.substring(0, this.alps.id.length - AlpsDescriptorMapper.REPRESENTATION_PREFIX.length) :
          undefined
      );
  }

  private getChildren(): Array<AlpsDescriptor> {
    return this.alps.descriptor;
  }

  /**
   * ALPS does not consider arrays, therefore a descriptor might also be the descriptor of the array's items.
   *
   * *This can lead to infinite loops, if the ALPS descriptor mapper is used without any other mapper.*
   */
  private getArrayItems(): AlpsDescriptor {
    return this.alps;
  }

  private getAssociatedResourceName(): string {
    if (this.alps.rt) {
      return new AlpsDescriptorAdapter(this.alps).getCollectionResourceName();
    }
    return null;
  }

  private toActions() {
    const actions: Array<ResourceAction> = [];
    const resourceName = this.name;
    const descriptorIds = this.allDescriptors.map(d => d.id);
    descriptorIds
      .filter(id => id)
      .forEach(id => {
        const action = this.toAction(id, resourceName);
        if (action) {
          actions.push(action);
        }
      });
    return actions.length > 0 ? new ResourceActions(actions) : null;
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
