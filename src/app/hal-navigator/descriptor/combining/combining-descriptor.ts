import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {NotNull} from '../../../decorators/not-null';
import {FormField} from 'app/hal-navigator/form/form-field';
import {FormFieldOptions} from 'app/hal-navigator/form/form-field-options';
import {FormFieldType} from 'app/hal-navigator/form/form-field-type';
import {DateTimeType} from '@hal-navigator/config/module-configuration';

/**
 * Accepts a list of descriptors. Each request is forwarded to any item of this list.
 * The first defined result is returned.
 */
export class CombiningDescriptor implements PropertyDescriptor {
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

  toFormField(): FormField {
    const fields = this.priorityList.map(d => d.toFormField()).filter(f => f);
    return this.mergeFormFields(fields);
  }

  private mergeFormFields(fields: Array<FormField>): FormField {
    const options = fields.map(f => f.options).filter(o => o);
    const formFieldOptions = new FormFieldOptions();
    const type = this.getFirstResultIn(fields, f => f.type);
    const formField = new FormField(
      this.getFirstResultIn(fields, f => f.name),
      type,
      this.getFirstResultIn(fields, f => f.required),
      this.getFirstResultIn(fields, f => f.readOnly),
      this.getFirstResultIn(fields, f => f.title),
      formFieldOptions
    );
    formFieldOptions.setLinkedResource(this.getFirstResultIn(options, o => o.getLinkedResource()));
    formFieldOptions.setOptions(this.getFirstResultIn(options, o => o.getOptions()));
    formFieldOptions.setDateTimeType(this.getFirstResultIn(options, o => o.getDateTimeType(), DateTimeType.DATE_TIME));
    const arraySpecs = options.map(o => o.getArraySpec()).filter(f => f);
    if (arraySpecs.length > 0 && type === FormFieldType.ARRAY) {
      formFieldOptions.setArraySpec(this.mergeFormFields(arraySpecs));
    }
    const subFields = options.map(o => o.getSubFields()).filter(sf => sf);
    if (subFields.length > 0) {
      formFieldOptions.setSubFields(this.regroupAndMap(subFields,
        f => f.name, f => this.mergeFormFields(f)).filter(f => f));
    }
    return formField.type ? formField : null;
  }

  getChild(resourceName: string): PropertyDescriptor {
    return new CombiningDescriptor(this.priorityList
      .map(d => d.getChild(resourceName))
      .filter(d => d));
  }

  getChildren(): CombiningDescriptor[] {
    return this.regroupAndMap(this.priorityList.map(d => d.getChildren()),
      d => d.getName(),
      children => new CombiningDescriptor(children));
  }

  private getFirstResult<T>(f: (d: PropertyDescriptor) => T): T {
    return this.getFirstResultIn(this.priorityList, f);
  }

  private getFirstResultIn<S, T>(array: Array<S>, f: (d: S) => T, defaultValue: T = undefined): T {
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
