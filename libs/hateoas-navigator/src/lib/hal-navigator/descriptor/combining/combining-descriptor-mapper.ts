import {FormFieldBuilder} from '../../form/form-field-builder';
import {FormFieldType} from '../../form/form-field-type';
import {PropDescriptor} from '../deprecated-property-descriptor';
import {DescriptorMapper} from '../mapper/descriptor-mapper';
import {DescriptorBuilder} from '../mapper/descriptor-builder';
import {ResourceDescriptor} from '../deprecated-resource-descriptor';
import {ResourceActions} from '../actions/resource-actions';
import {DescriptorFactory} from 'hateoas-navigator/hal-navigator/descriptor/descriptor-factory';

/**
 * Accepts a list of descriptors. Each request is forwarded to any item of this list.
 * The first defined result is returned.
 */
export class CombiningDescriptorMapper extends DescriptorMapper<Array<PropDescriptor>> { // TODO: Should be based on other mappers
  private readonly resourceDescriptors: ResourceDescriptor[];
  private descriptorFactory = new DescriptorFactory();

  constructor(private priorityList: Array<PropDescriptor>) {
    super();
    if (priorityList.length === 0) {
      throw new Error('Invalid descriptor: No descriptors to combine');
    }
    this.resourceDescriptors = priorityList.map(d => d as any as ResourceDescriptor).filter(d => d.getActions);
  }

  protected static getFirstResultIn<S, T>(array: Array<S>, f: (d: S) => T, defaultValue?: T): T {
    for (const d of array) {
      const result = f(d);
      if (result !== undefined) {
        return result;
      }
    }
    return defaultValue;
  }

  private static mergeFormFields(fields: Array<FormFieldBuilder>): FormFieldBuilder {
    return fields.reduce((mergedForm: FormFieldBuilder, newForm: FormFieldBuilder) => mergedForm.combineWith(newForm),
      new FormFieldBuilder());
  }

  private static getFirstResult<S, T>(array: S[], f: (d: S) => T): T {
    return CombiningDescriptorMapper.getFirstResultIn(array, f);
  }

  private static pushToArrayGivenByName<T>(arraysByName: { [key: string]: T[] },
                                           newElement: T, groupByKey: (item: T) => string) {
    const key = groupByKey(newElement);
    const descriptors = arraysByName[key];
    if (descriptors) {
      descriptors.push(newElement);
    } else {
      arraysByName[key] = [newElement];
    }
    return arraysByName;
  }

  map(builder: DescriptorBuilder<Array<PropDescriptor>>) {
    builder.withActions(this.getActions())
      .withArrayItems(this.getArrayItemsDescriptor())
      .withAssociation(this.getAssociatedResourceName())
      .withChildren(this.getChildrenDescriptors())
      .withName(this.getName())
      .withTitle(this.getTitle())
      .withLinkFunction((uri: string) => this.getDescriptorForLink(uri))
      .withFieldProcessor(
        field => this.priorityList.map(d => d.toFormFieldBuilder())
          .reduce((mergedForm: FormFieldBuilder, newForm: FormFieldBuilder) => mergedForm.combineWith(newForm), field)
      )
      .withBuilder(descriptors => new CombiningDescriptorMapper(descriptors));
  }

  getAssociatedResourceName() {
    return CombiningDescriptorMapper.getFirstResult(this.descriptorFactory.asAssociations(this.priorityList),
      d => d.getAssociatedResourceName());
  }

  toFormFieldBuilder(): FormFieldBuilder {
    const fields = this.priorityList.map(d => d.toFormFieldBuilder()).filter(f => f);
    return CombiningDescriptorMapper.mergeFormFields(fields);
  }

  getChildrenDescriptors(): Array<PropDescriptor[]> {
    return this.regroupAndMap(this.descriptorFactory.asObjects(this.priorityList).map(d => d.getChildDescriptors()),
      d => d.getName());
  }

  getArrayItemsDescriptor(): Array<PropDescriptor> {
    const formField = this.toFormFieldBuilder().build();
    if (formField && formField.getType() === FormFieldType.ARRAY) {
      return this.descriptorFactory.asArrays(this.priorityList).map(d => d.getItemsDescriptor()).filter((d => d));
    }
  }

  protected extractDescriptor<T>(descriptors: T[], mappingFunction: (descriptor: T) => T):
    T[] {
    const children = descriptors.map(d => mappingFunction(d)).filter(d => d);
    return children.length > 0 ? children : null;
  }

  getTitle(): string {
    return CombiningDescriptorMapper.getFirstResult(this.priorityList, d => d.getTitle());
  }

  getName(): string {
    return CombiningDescriptorMapper.getFirstResult(this.priorityList, d => d.getName());
  }

  getActions(): ResourceActions {
    return this.resourceDescriptors
      .filter(d => d.getActions())
      .reduce((previous, current) => previous.include(current.getActions()), new ResourceActions([]));
  }

  getDescriptorForLink(uri: string): ResourceDescriptor[] {
    return this.extractDescriptor(this.resourceDescriptors, d => d.getDescriptorForLink(uri));
  }

  private regroupAndMap<T>(arrayOfArrays: Array<T[]>, groupByKey: (item: T) => string) {
    const arraysByName: { [key: string]: T[] } = arrayOfArrays
      .reduce((c1, c2) => c1.concat(c2), [])
      .reduce((children, child) => CombiningDescriptorMapper.pushToArrayGivenByName(children, child, groupByKey), {});
    return Object.keys(arraysByName)
      .map(key => arraysByName[key]);
  }
}
