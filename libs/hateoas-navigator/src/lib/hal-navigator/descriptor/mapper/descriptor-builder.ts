import {ResourceActions} from '../actions/resource-actions';
import {DescriptorMapper} from './descriptor-mapper';
import {
  ArrayPropertyDescriptor, AssociationPropertyDescriptor,
  ObjectPropertyDescriptor,
  PropDescriptor
} from '../deprecated-property-descriptor';
import {FormFieldBuilder} from '../../form/form-field-builder';
import {ResourceDescriptor} from 'hateoas-navigator/hal-navigator/descriptor/deprecated-resource-descriptor';
import apply = Reflect.apply;

type FieldProcessor = (fieldBuilder: FormFieldBuilder) => FormFieldBuilder;

class PropertyDescriptorImpl implements PropDescriptor {
  /**
   *
   * @param name An array item does not necessarily requires a name. All other descriptors do.
   * @param title May be undefined.
   * @param fieldProcessor Must not be null/undefined
   */
  constructor(private name: string, private title: string, private fieldProcessor: FieldProcessor) {
  }

  getName(): string {
    return this.name;
  }

  getTitle(): string {
    return this.title;
  }

  toFormFieldBuilder(): FormFieldBuilder {
    return this.fieldProcessor(new FormFieldBuilder(this.getName()));
  }

  orNull<T extends PropDescriptor, R>(fct: (d: T) => R, ...args): R {
    try {
      return apply(fct, this, args);
    } catch (e) {
      return null;
    }
  }
}

class ArrayDescriptorImpl extends PropertyDescriptorImpl implements ArrayPropertyDescriptor<PropDescriptor> {
  constructor(name: string, title: string, private arrayItems: PropDescriptor, fieldProcessor: FieldProcessor) {
    super(name, title, fieldProcessor);
    if (!this.arrayItems) {
      throw new Error('An array requires array items');
    }
  }

  getItemsDescriptor(): PropDescriptor {
    return this.arrayItems;
  }

  toFormFieldBuilder(): FormFieldBuilder {
    return super.toFormFieldBuilder()
      .withArraySpecProvider(() => this.arrayItems.toFormFieldBuilder());
  }
}

class ObjectDescriptorImpl extends PropertyDescriptorImpl implements ObjectPropertyDescriptor {
  constructor(name: string, title: string, private children: PropDescriptor[], fieldProcessor: FieldProcessor) {
    super(name, title, fieldProcessor);
    if (!children) {
      throw new Error('An object requires child properties');
    }
  }

  getChildDescriptor<T extends PropDescriptor>(resourceName: string): T {
    return this.children.find(d => d.getName() === resourceName) as T;
  }

  getChildDescriptors<T extends PropDescriptor>(): Array<T> {
    return this.children as T[];
  }

  toFormFieldBuilder() {
    return super.toFormFieldBuilder()
      .withSubFields(this.getChildDescriptors().map(d => d.toFormFieldBuilder()));
  }
}

class AssociationDescriptorImpl extends PropertyDescriptorImpl implements AssociationPropertyDescriptor {
  constructor(name: string, title: string, private association: string, fieldProcessor: FieldProcessor) {
    super(name, title, fieldProcessor);
    if (!association) {
      throw new Error('An association requires the associated resource name');
    }
  }

  getAssociatedResourceName(): string {
    return this.association;
  }

  toFormFieldBuilder(): FormFieldBuilder {
    return super.toFormFieldBuilder()
      .withLinkedResource(this.getAssociatedResourceName());
  }
}

/**
 * A resource descriptor might know only links OR actions.
 */
class ResourceDescriptorImpl extends ObjectDescriptorImpl implements ResourceDescriptor {
  constructor(name: string, title: string, children: PropDescriptor[], private actions: ResourceActions,
              private linkFunction: (uri: string) => ResourceDescriptor, fieldProcessor: FieldProcessor) {
    super(name, title, children, fieldProcessor);
    if (!linkFunction && !actions) {
      throw new Error('Not a valid resource');
    }
  }

  getActions(): ResourceActions {
    return this.actions;
  }

  getDescriptorForLink(uri: string): ResourceDescriptor {
    return this.linkFunction ? this.linkFunction(uri) : undefined;
  }
}

export class DescriptorBuilder<T> {
  private name: string;
  private title: string;
  private actions: ResourceActions;
  private children: Array<T>;
  private arrayItems: T;
  private association: string;
  private linkFunction: (uri: string) => T;
  private builderFunction: (value: T) => DescriptorMapper<T>;
  private fieldProcessor: FieldProcessor = processor => processor;

  withName(name: string) {
    this.name = name;
    return this;
  }

  withActions(actions: ResourceActions) {
    this.actions = actions;
    return this;
  }

  withChildren(children: Array<T>) {
    this.children = children;
    return this;
  }

  withArrayItems(arrayItems: T) {
    this.arrayItems = arrayItems;
    return this;
  }

  withAssociation(name: string) {
    this.association = name;
    return this;
  }

  withTitle(title: string) {
    this.title = title;
    return this;
  }

  withBuilder(builderFunction: (value: T) => DescriptorMapper<T>) {
    this.builderFunction = builderFunction;
    return this;
  }

  toDescriptor(): PropDescriptor {
    let descriptor: PropDescriptor;
    if (this.arrayItems) {
      this.assertNoObject();
      this.assertNoResource();
      this.assertNoAssociation();
      descriptor = new ArrayDescriptorImpl(this.name, this.title, this.buildDescriptor(this.arrayItems), this.fieldProcessor);
    } else if (this.children) {
      this.assertNoAssociation();
      const children = this.buildDescriptors(this.children);
      if (this.actions || this.linkFunction) {
        descriptor = new ResourceDescriptorImpl(this.name, this.title, children, this.actions,
          (uri: string) => this.buildDescriptor(this.linkFunction(uri)) as ResourceDescriptor, this.fieldProcessor);
      } else {
        this.assertNoResource();
        descriptor = new ObjectDescriptorImpl(this.name, this.title, children, this.fieldProcessor);
      }
    } else if (this.association) {
      this.assertNoResource();
      descriptor = new AssociationDescriptorImpl(this.name, this.title, this.association, this.fieldProcessor);
    } else {
      this.assertNoResource();
      descriptor = new PropertyDescriptorImpl(this.name, this.title, this.fieldProcessor);
    }
    return descriptor;
  }

  private buildDescriptor(value: T): PropDescriptor {
    return this.builderFunction(value).toDescriptor();
  }

  private buildDescriptors(children: Array<T>): PropDescriptor[] {
    return children.map(c => this.buildDescriptor(c));
  }

  private assertNoResource() {
    if (this.linkFunction || this.actions) {
      throw new Error(`This descriptor should not describe a resource, but has linkFunction or actions`);
    }
  }

  private assertNoAssociation() {
    if (this.association) {
      throw new Error(`This descriptor should not describe an association, but was ${this.association}`);
    }
  }

  private assertNoObject() {
    if (this.children) {
      throw new Error(`This descriptor should not describe an object, but has children ${this.children}`);
    }
  }

  withLinkFunction(linkFunction: (uri: string) => T) {
    this.linkFunction = linkFunction;
    return this;
  }

  withFieldProcessor(fieldProcessor: FieldProcessor) {
    this.fieldProcessor = fieldProcessor;
    return this;
  }
}
