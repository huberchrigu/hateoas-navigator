import {ResourceActions} from '../actions';
import {DescriptorMapper} from './descriptor-mapper';
import {GenericPropertyDescriptor} from '../generic-property-descriptor';
import {ResourceObjectDescriptor} from '../resource-object-descriptor';
import {LOGGER} from '../../../logging';
import {PropertyDescriptorImpl} from './internal/property-descriptor-impl';
import {ArrayDescriptorImpl} from './internal/array-descriptor-impl';
import {ObjectDescriptorImpl} from './internal/object-descriptor-impl';
import {AssociationDescriptorImpl} from './internal/association-descriptor-impl';
import {ResourceDescriptorImpl} from './internal/resource-descriptor-impl';
import {DescriptorType} from './internal/descriptor-type';
import {FormFieldBuilder, FormFieldType} from '../../form';
import {FieldProcessor} from './internal/field-processor';

/**
 * A builder does not only simplify building a new [PropertyDescriptor],
 * it also provides an intermediate state of know-how about a property. E.g. based on ALPS the type of the
 * described property cannot be determined. The descriptor therefore adds details for arrays as well as associations.
 * Combined with other know-how, this will accomplish the required information later.
 */
export class DescriptorBuilder<T> {
  /**
   * This is a special flag for association types: White it is an association for GETs (it points to an URI containing
   * a single or an array of resource items), it is an array of associations for POST/PUTs.
   */
  public isArrayOfAssociations: boolean | undefined = undefined;
  public name: string | undefined;
  public title: string | undefined;
  public actions: ResourceActions | undefined;
  public children: Array<T> | null | undefined;
  public arrayItems: T | null | undefined;
  public association: string | undefined;
  public linkFunction: ((uri: string) => T | null) | undefined;
  public builderFunction: ((value: T) => DescriptorMapper<T> | null) | undefined;
  public type?: DescriptorType;
  private logResult = false;
  public fieldProcessor: FieldProcessor = processor => processor;

  constructor(public mapperName: string) {
  }

  /**
   * Logs this builder's result.
   */
  setLogResult(): void {
    this.logResult = true;
  }

  withType(type: DescriptorType | undefined) {
    this.type = type;
    return this;
  }

  withName(name: string | undefined) {
    this.name = name;
    return this;
  }

  withActions(actions: ResourceActions) {
    this.actions = actions;
    return this;
  }

  withChildren(children: Array<T> | null) {
    this.children = children;
    return this;
  }

  withArrayItems(arrayItems: T | null | undefined) {
    this.arrayItems = arrayItems;
    return this;
  }

  withAssociation(name: string | undefined) {
    this.association = name;
    return this;
  }

  withTitle(title: string | undefined) {
    this.title = title;
    return this;
  }

  withBuilder(builderFunction: (value: T) => DescriptorMapper<T>) {
    this.builderFunction = builderFunction;
    return this;
  }

  withLinkFunction(linkFunction: ((uri: string) => T | null) | undefined) {
    this.linkFunction = linkFunction;
    return this;
  }

  withFieldProcessor(fieldProcessor: FieldProcessor) {
    this.fieldProcessor = fieldProcessor;
    return this;
  }

  withIsArrayOfAssociations(isArrayOfAssociations: boolean | undefined) {
    this.isArrayOfAssociations = isArrayOfAssociations;
    return this;
  }

  /**
   * If the {@link DescriptorType} was explicitly set, such a descriptor will be created. Otherwise the descriptor type is guessed
   * based on the set properties.
   * An resource is handled like a sub-type of an object, i.e. it has children or the object/resource type, plus the resource type or a
   * resource property like actions or link functions.
   */
  toDescriptor(): GenericPropertyDescriptor {
    let descriptor: GenericPropertyDescriptor;
    if (this.isType('array', !!this.arrayItems)) {
      descriptor = new ArrayDescriptorImpl(this.name, this.title, this.buildDescriptor(this.arrayItems!), this.fieldProcessor);
    } else if (this.isType('object', !!this.children) || this.isType('resource')) {
      const children = this.buildDescriptors(this.children);
      if (this.isType('resource') || this.actions || this.linkFunction) {
        if (!this.actions) {
          this.logWarning('The resource descriptor does not provide actions.');
        }
        if (!this.linkFunction) {
          this.logWarning('The resource descriptor does not provide a link function.');
        }
        descriptor = new ResourceDescriptorImpl(this.name, this.title, children, this.actions,
          (uri: string) => this.buildDescriptor(this.linkFunction!(uri)!) as ResourceObjectDescriptor, this.fieldProcessor!);
      } else {
        descriptor = new ObjectDescriptorImpl(this.name, this.title, children, this.fieldProcessor!);
      }
    } else if (this.isType('association', !!this.association)) {
      descriptor = this.getDescriptorForAssociationType();
    } else {
      if (this.type !== 'primitive') {
        this.logWarning('The type "primitive" was auto-guessed. Try to set the type explicitly.');
      }
      descriptor = new PropertyDescriptorImpl(this.name, this.title, this.fieldProcessor!);
    }
    if (this.logResult) {
      LOGGER.debug(this.mapperName + ' -> ' + JSON.stringify(descriptor));
    }
    return descriptor;
  }

  /**
   * An association can point to a single resource item or to an array of resource items.
   */
  private getDescriptorForAssociationType() {
    const associationDescriptor = new AssociationDescriptorImpl(this.name, this.title, this.association, this.fieldProcessor!);
    const isArrayOfAssociations = this.isArrayOfAssociations !== undefined ? this.isArrayOfAssociations : this.name!.endsWith('s');
    if (isArrayOfAssociations) {
      if (this.isArrayOfAssociations === undefined) {
        this.logWarning('It was auto-guessed to be an array of associations. Rather set the according configuration instead.');
      }
      const arrayFieldProperties = (formFieldBuilder: FormFieldBuilder) => this.fieldProcessor!(formFieldBuilder)
        .withType(FormFieldType.ARRAY);
      return new ArrayDescriptorImpl(this.name, this.title, associationDescriptor, arrayFieldProperties);
    } else {
      return associationDescriptor;
    }
  }

  /**
   * @param guess True if a property was given that assumes this type. False if not such property given and null/undefined otherwise.
   */
  private isType(type: DescriptorType, guess?: boolean) {
    if (this.type) {
      const result = this.type === type;
      if (guess === false && result || guess === true && !result) {
        this.logWarning(`The property is${result ? '' : ' not'} of type "${type}", but the auto-guess says the opposite.
        Please try to ${result ? 'set' : 'unset'} the according descriptor attributes according to the type.`);
      }
      return result;
    }
    if (guess) {
      this.logWarning(`Type "${type}" was auto-guessed. Try to set the type explicitly.`);
      return true;
    }
    return false;
  }

  private logWarning(message: string) {
    LOGGER.warn(`${this.mapperName}, ${this.name ? 'property ' + this.name : 'array item'}: ${message}`);
  }

  private buildDescriptor(value: T): GenericPropertyDescriptor {
    return this.builderFunction!(value)!.toDescriptor();
  }

  private buildDescriptors(children: Array<T> | null | undefined): GenericPropertyDescriptor[] {
    return children!.map(c => this.buildDescriptor(c));
  }
}
