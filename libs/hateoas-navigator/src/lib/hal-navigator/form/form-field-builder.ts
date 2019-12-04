import {LOGGER} from '../../logging/logger';
import {FormFieldType} from './form-field-type';
import {DateTimeType, FormFieldSupport} from '../config';
import {FormField} from './form-field';
import {SubFormField} from './sub-form-field';
import {ArrayField} from './array-field';
import {DatePickerField} from './date-picker-field';
import {SelectField} from './select-field';
import {LinkField} from './link-field';

/**
 * The builder works by only accepting values that are non-null are not empty (sub-fields). Like this it is able to guess the right
 * form type from just its fed attributes.
 * <p>
 *     The only exception is the form items specification, because at the time of building a form field, only the array specification
 *     builders are given. To prevent endless loops, they are only called when the type is explicitly ARRAY.
 */
export class FormFieldBuilder {
  private static readonly ONE_VALUE_FIELDS = ['type', 'required', 'readOnly', 'title',
    'options', 'dateTimeType', 'linkedResource'];

  private type: FormFieldType;
  private required: boolean;
  private readOnly: boolean;
  private title: string;
  private arraySpecProviders: Array<() => FormFieldBuilder>;
  private subFields: FormFieldBuilder[];
  private options: any[];
  private dateTimeType: DateTimeType;
  private linkedResource: string;

  constructor(private name?: string) {
  }

  withType(type: FormFieldType) {
    this.type = type;
    return this;
  }

  withRequired(required: boolean) {
    this.required = required;
    return this;
  }

  withReadOnly(readOnly: boolean) {
    this.readOnly = readOnly;
    return this;
  }

  withTitle(title: string) {
    this.title = title;
    return this;
  }

  withArraySpecProvider(arraySpecProvider: () => FormFieldBuilder) {
    if (this.arraySpecProviders) {
      throw new Error('One or multiple array specifications were already provided, overwriting them would lead to inconsistencies');
    }
    this.arraySpecProviders = [arraySpecProvider];
    return this;
  }

  withSubFields(subFields: FormFieldBuilder[]): this {
    if (subFields && subFields.length > 0) {
      this.subFields = subFields;
    }
    return this;
  }

  withOptions(options: any[]) {
    this.options = options;
    return this;
  }

  withDateTimeType(dateTimeType: DateTimeType) {
    this.dateTimeType = dateTimeType;
    return this;
  }

  withLinkedResource(resourceName: string) {
    this.linkedResource = resourceName;
    return this;
  }

  /**
   * @return null if the type or name is null.
   */
  build(): FormField {
    const type = this.type ? this.type : this.guessType();
    if (!type) {
      LOGGER.warn('Form field ' + this.name + ' will be skipped since its type is missing');
      return null;
    }
    let formField: FormField;
    if (type === FormFieldType.SUB_FORM) {
      this.assertEmptyAttributes(type, this.dateTimeType, this.options, this.linkedResource);
      formField = new SubFormField(this.name, this.required, this.readOnly, this.title,
        this.subFields ? this.subFields.map(sf => sf.build()).filter(f => f) : []);
    } else if (type === FormFieldType.ARRAY) {
      // as an array might contain the same definition as its spec, ignore other attributes
      formField = new ArrayField(this.name, this.required, this.readOnly, this.title, this.evaluateArraySpec().build());
    } else if (type === FormFieldType.DATE_PICKER) {
      this.assertEmptyAttributes(type, this.subFields, this.options, this.linkedResource);
      formField = new DatePickerField(this.name, this.required, this.readOnly, this.title, this.dateTimeType);
    } else if (type === FormFieldType.SELECT) {
      this.assertEmptyAttributes(type, this.subFields, this.dateTimeType, this.linkedResource);
      formField = new SelectField(this.name, this.required, this.readOnly, this.title, this.options);
    } else if (type === FormFieldType.LINK) {
      this.assertEmptyAttributes(type, this.subFields, this.dateTimeType, this.options);
      formField = new LinkField(this.name, this.required, this.readOnly, this.title, this.linkedResource);
    } else {
      this.assertEmptyAttributes(type, this.subFields, this.dateTimeType, this.options, this.linkedResource);
      formField = new FormField(this.name, this.type, this.required, this.readOnly, this.title);
    }
    return formField;
  }

  combineWith(other: FormFieldBuilder) {
    if (!this.name) {
      this.name = other.name;
    }
    this.setIfEmpty(other, FormFieldBuilder.ONE_VALUE_FIELDS);
    this.combineArraySpec(other.arraySpecProviders);
    this.combineSubFields(other.subFields);
    return this;
  }

  /**
   *
   * @param config May be <code>null</code>.
   */
  fromConfig(config: FormFieldSupport) {
    if (config) {
      return this.setIfDefined(config.dateTimeType, v => this.withDateTimeType(v))
        .setIfDefined(config.enumOptions, v => this.withOptions(v))
        .setIfDefined(config.title, v => this.withTitle(v))
        .setIfDefined(config.type, v => this.withType(v));
    }
    return this;
  }

  private guessType(): FormFieldType {
    if (this.subFields) {
      return FormFieldType.SUB_FORM;
    } else if (this.dateTimeType) {
      return FormFieldType.DATE_PICKER;
    } else if (this.options) {
      return FormFieldType.SELECT;
    } else if (this.linkedResource) {
      return FormFieldType.LINK;
    }
    return null;
  }

  private assertEmptyAttributes(type: FormFieldType, ...attributes: any[]) {
    if (attributes.some(a => !!a)) {
      throw new Error('This form field of type ' + type + ' has attributes that do not match with the type: ' + JSON.stringify(this));
    }
  }

  private setIfEmpty(other: FormFieldBuilder, attributes: string[]) {
    attributes.forEach(attribute => {
      if (this[attribute] === undefined) {
        this[attribute] = other[attribute];
      }
    });
  }

  /**
   * Array specifications should only be resolved when needed. Therefore the providers are collected and evaluated during the build phase.
   */
  private combineArraySpec(others: Array<() => FormFieldBuilder>) {
    if (!others) {
      return;
    }
    if (this.arraySpecProviders) {
      this.arraySpecProviders = this.arraySpecProviders.concat(others);
    } else {
      this.arraySpecProviders = others;
    }
  }

  private combineSubFields(other: FormFieldBuilder[]) {
    if (!other) {
      return;
    }
    const newSubFields = {};
    if (this.subFields) {
      this.groupByName(newSubFields, this.subFields);
    }
    this.groupByName(newSubFields, other);
    this.subFields = Object.keys(newSubFields).map(fieldName => newSubFields[fieldName]);
  }

  private groupByName(nameFieldMap: { [fieldName: string]: FormFieldBuilder }, addFields: FormFieldBuilder[]) {
    addFields.forEach(field => {
      if (!field.name) {
        throw new Error('A sub-field without name cannot be attached: ' + JSON.stringify(field));
      }
      const existing = nameFieldMap[field.name];
      if (existing) {
        nameFieldMap[field.name] = existing.combineWith(field);
      } else {
        nameFieldMap[field.name] = field;
      }
    });
  }

  private evaluateArraySpec() {
    return this.arraySpecProviders.reduce((previous, current) => {
      const newSpec = current();
      return newSpec ? previous.combineWith(newSpec) : previous;
    }, new FormFieldBuilder());
  }

  private setIfDefined<T>(value: T, setter: (v: T) => this) {
    return value ? setter(value) : this;
  }
}
