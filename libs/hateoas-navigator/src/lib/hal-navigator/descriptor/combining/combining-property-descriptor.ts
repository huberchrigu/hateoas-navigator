import {NotNull} from '../../../decorators/not-null';
import {FormFieldBuilder} from '../../form/form-field-builder';
import {FormFieldType} from '../../form/form-field-type';
import {DeprecatedPropertyDescriptor} from '../deprecated-property-descriptor';
import {CombiningResourceDescriptor} from './combining-resource-descriptor';
import {DeprecatedResourceDescriptor} from 'hateoas-navigator';

/**
 * Accepts a list of descriptors. Each request is forwarded to any item of this list.
 * The first defined result is returned.
 */
export class CombiningPropertyDescriptor implements DeprecatedPropertyDescriptor {
  constructor(private priorityList: Array<DeprecatedPropertyDescriptor>) {
    if (priorityList.length === 0) {
      throw new Error('Invalid descriptor: No descriptors to combine');
    }
  }

  @NotNull()
  getTitle(): string {
    return this.getFirstResult(d => d.getTitle());
  }

  @NotNull()
  getName(): string {
    return this.getFirstResult(d => d.getName());
  }

  getAssociatedResourceName() {
    return this.getFirstResult(d => d.getAssociatedResourceName());
  }

  toFormFieldBuilder(): FormFieldBuilder {
    const fields = this.priorityList.map(d => d.toFormFieldBuilder()).filter(f => f);
    return CombiningPropertyDescriptor.mergeFormFields(fields);
  }

  getChildDescriptor(resourceName: string): CombiningResourceDescriptor {
    return new CombiningResourceDescriptor(this.priorityList
      .map(d => d.getChildDescriptor(resourceName))
      .filter(d => d));
  }

  getChildResourceDesc(childResource: string): DeprecatedResourceDescriptor {
    return this.extractDescriptor(this.priorityList, d => d.getChildResourceDesc(childResource) as DeprecatedResourceDescriptor);
  }

  getChildrenDescriptors(): CombiningResourceDescriptor[] {
    return this.regroupAndMap(this.priorityList.map(d => d.getChildrenDescriptors()),
      d => d.getName(),
      children => new CombiningResourceDescriptor(children));
  }

  getArrayItemsDescriptor(): CombiningResourceDescriptor {
    const formField = this.toFormFieldBuilder().build();
    if (formField && formField.getType() === FormFieldType.ARRAY) {
      const items = this.priorityList.map(d => d.getArrayItemsDescriptor()).filter((d => d));
      return new CombiningResourceDescriptor(items);
    }
  }

  private static mergeFormFields(fields: Array<FormFieldBuilder>): FormFieldBuilder {
    return fields.reduce((mergedForm: FormFieldBuilder, newForm: FormFieldBuilder) => mergedForm.combineWith(newForm),
      new FormFieldBuilder());
  }

  private getFirstResult<T>(f: (d: DeprecatedPropertyDescriptor) => T): T {
    return CombiningPropertyDescriptor.getFirstResultIn(this.priorityList, f);
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

  protected extractDescriptor<T extends DeprecatedPropertyDescriptor>(descriptors: T[], mappingFunction: (descriptor: T) => DeprecatedResourceDescriptor) {
    const children = descriptors.map(d => mappingFunction(d)).filter(d => d);
    return children.length > 0 ? new CombiningResourceDescriptor(children) : null;
  }

  private regroupAndMap<T, U>(arrayOfArrays: Array<T[]>, groupByKey: (item: T) => string, finalMapping: (children: Array<T>) => U) {

    const arraysByName: { [key: string]: T[] } = arrayOfArrays
      .reduce((c1, c2) => c1.concat(c2), [])
      .reduce((children, child) => CombiningPropertyDescriptor.pushToArrayGivenByName(children, child, groupByKey), {});
    return Object.keys(arraysByName)
      .map(key => finalMapping(arraysByName[key]));
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
}
