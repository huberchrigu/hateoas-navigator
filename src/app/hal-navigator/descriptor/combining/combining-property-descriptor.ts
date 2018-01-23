import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {NotNull} from '../../../decorators/not-null';
import {FormFieldType} from 'app/hal-navigator/form/form-field-type';
import {FormFieldBuilder} from '@hal-navigator/form/form-field-builder';

/**
 * Accepts a list of descriptors. Each request is forwarded to any item of this list.
 * The first defined result is returned.
 */
export class CombiningPropertyDescriptor implements PropertyDescriptor {
  constructor(private priorityList: Array<PropertyDescriptor>) {
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
    return this.mergeFormFields(fields);
  }

  getChildDescriptor(resourceName: string): PropertyDescriptor {
    return new CombiningPropertyDescriptor(this.priorityList
      .map(d => d.getChildDescriptor(resourceName))
      .filter(d => d));
  }

  getChildrenDescriptors(): CombiningPropertyDescriptor[] {
    return this.regroupAndMap(this.priorityList.map(d => d.getChildrenDescriptors()),
      d => d.getName(),
      children => new CombiningPropertyDescriptor(children));
  }

  getArrayItemsDescriptor(): CombiningPropertyDescriptor {
    const formField = this.toFormFieldBuilder().build();
    if (formField && formField.getType() === FormFieldType.ARRAY) {
      const items = this.priorityList.map(d => d.getArrayItemsDescriptor()).filter((d => d));
      return new CombiningPropertyDescriptor(items);
    }
  }

  private mergeFormFields(fields: Array<FormFieldBuilder>): FormFieldBuilder {
    return fields.reduce((mergedForm: FormFieldBuilder, newForm: FormFieldBuilder) => mergedForm.combineWith(newForm),
      new FormFieldBuilder());
  }

  private getFirstResult<T>(f: (d: PropertyDescriptor) => T): T {
    return this.getFirstResultIn(this.priorityList, f);
  }

  protected getFirstResultIn<S, T>(array: Array<S>, f: (d: S) => T, defaultValue: T = undefined): T {
    for (const d of array) {
      const result = f(d);
      if (result !== undefined) {
        return result;
      }
    }
    return defaultValue;
  }

  private regroupAndMap<T, U>(arrayOfArrays: Array<T[]>, groupByKey: (item: T) => string, finalMapping: (children: Array<T>) => U) {

    const arraysByName: { [key: string]: T[] } = arrayOfArrays
      .reduce((c1, c2) => c1.concat(c2), [])
      .reduce((children, child) => this.pushToArrayGivenByName(children, child, groupByKey), {});
    return Object.keys(arraysByName)
      .map(key => finalMapping(arraysByName[key]));
  }

  private pushToArrayGivenByName<T>(arraysByName: { [key: string]: T[] },
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
