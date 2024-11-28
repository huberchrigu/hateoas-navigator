import {PropertyDescriptorImpl} from './property-descriptor-impl';
import {AssociationDescriptor} from '../../generic-property-descriptor';
import {ResourceObjectDescriptor} from '../../resource-object-descriptor';
import {FormFieldBuilder} from '../../../form';
import {NotNull} from '../../../../decorators/not-null';
import {ResourceDescriptorProvider} from '../../provider/resource-descriptor-provider';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {FieldProcessor} from './field-processor';

export class AssociationDescriptorImpl extends PropertyDescriptorImpl implements AssociationDescriptor {
  private resolvedResource: ResourceObjectDescriptor | undefined;

  constructor(name: string | undefined, title: string | undefined, private association: string | undefined, fieldProcessor: FieldProcessor) {
    super(name, title, fieldProcessor);
    if (!association) {
      throw new Error('An association requires the associated resource name');
    }
  }

  getAssociatedResourceName(): string {
    return this.association!;
  }

  override toFormFieldBuilder(): FormFieldBuilder {
    return super.toFormFieldBuilder()
      .withLinkedResource(this.getAssociatedResourceName());
  }

  @NotNull(() => 'Association must be resolved before')
  getResource(): ResourceObjectDescriptor {
    return this.resolvedResource!;
  }

  resolveResource(descriptorProvider: ResourceDescriptorProvider): Observable<ResourceObjectDescriptor> {
    return descriptorProvider.resolve(this.getAssociatedResourceName()).pipe(
      tap(d => this.setResolvedResource(d))
    );
  }

  setResolvedResource(associatedResourceDesc: ResourceObjectDescriptor): void {
    this.resolvedResource = associatedResourceDesc;
  }
}
