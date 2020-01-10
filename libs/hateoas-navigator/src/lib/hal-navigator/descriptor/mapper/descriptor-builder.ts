import {ResourceActions} from '../actions/resource-actions';
import {DescriptorMapper} from './descriptor-mapper';
import {
  AbstractPropDescriptor,
  ArrayPropertyDescriptor, AssociationPropertyDescriptor,
  ObjectPropertyDescriptor, PropDescriptor
} from '../prop-descriptor';
import {FormFieldBuilder} from '../../form/form-field-builder';
import {ResourceDescriptor} from '../resource-descriptor';
import {Observable} from 'rxjs';
import {NotNull} from '../../../decorators/not-null';
import {tap} from 'rxjs/operators';
import {ResourceDescriptorProvider} from '../provider/resource-descriptor-provider';
import {LOGGER} from '../../../logging/logger';

export type FieldProcessor = (fieldBuilder: FormFieldBuilder) => FormFieldBuilder;

class PropertyDescriptorImpl extends AbstractPropDescriptor {
  /**
   *
   * @param name An array item does not necessarily requires a name. All other descriptors do.
   * @param title May be undefined.
   * @param fieldProcessor Must not be null/undefined
   */
  constructor(private name: string, private title: string, private fieldProcessor: FieldProcessor) {
    super();
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
}

class ArrayDescriptorImpl extends PropertyDescriptorImpl implements ArrayPropertyDescriptor {
  constructor(name: string, title: string, private arrayItems: PropDescriptor, fieldProcessor: FieldProcessor) {
    super(name, title, fieldProcessor);
    if (!this.arrayItems) {
      throw new Error('An array requires array items');
    }
  }

  getItemsDescriptor<D extends PropDescriptor>(): D {
    return this.arrayItems as D;
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
  private resolvedResource: ResourceDescriptor;

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

  @NotNull(() => 'Association must be resolved before')
  getResource(): ResourceDescriptor {
    return this.resolvedResource;
  }

  resolveResource(descriptorProvider: ResourceDescriptorProvider): Observable<ResourceDescriptor> {
    return descriptorProvider.resolve(this.getAssociatedResourceName()).pipe(
      tap(d => this.setResolvedResource(d))
    );
  }

  setResolvedResource(associatedResourceDesc: ResourceDescriptor): void {
    this.resolvedResource = associatedResourceDesc;
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

export type DescriptorType = 'primitive' | 'object' | 'resource' | 'array' | 'association';

/**
 * A builder does not only simplify building a new [PropertyDescriptor],
 * it also provides an intermediate state of know-how about a property. E.g. based on ALPS the type of the
 * described property cannot be determined. The descriptor therefore adds details for arrays as well as associations.
 * Combined with other know-how, this will accomplish the required information later.
 */
export class DescriptorBuilder<T> {
  public name: string;
  public title: string;
  public actions: ResourceActions;
  public children: Array<T>;
  public arrayItems: T;
  public association: string;
  public linkFunction: (uri: string) => T;
  public builderFunction: (value: T) => DescriptorMapper<T>;
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

  withType(type: DescriptorType) {
    this.type = type;
    return this;
  }

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

  withLinkFunction(linkFunction: (uri: string) => T) {
    this.linkFunction = linkFunction;
    return this;
  }

  withFieldProcessor(fieldProcessor: FieldProcessor) {
    this.fieldProcessor = fieldProcessor;
    return this;
  }

  /**
   * If the {@link DescriptorType} was explicitly set, such a descriptor will be created. Otherwise the descriptor type is guessed
   * based on the set properties.
   * An resource is handled like a sub-type of an object, i.e. it has children or the object/resource type, plus the resource type or a
   * resource property like actions or link functions.
   */
  toDescriptor(): PropDescriptor {
    let descriptor: PropDescriptor;
    if (this.isType('array', !!this.arrayItems)) {
      descriptor = new ArrayDescriptorImpl(this.name, this.title, this.buildDescriptor(this.arrayItems), this.fieldProcessor);
    } else if (this.isType('object', !!this.children) || this.isType('resource')) {
      const children = this.buildDescriptors(this.children);
      if (this.isType('resource') || this.actions || this.linkFunction) {
        if (!this.actions || !this.linkFunction) {
          LOGGER.warn(`The resource descriptor for ${this.mapperName} does not provide either actions (value set: ${!!this.actions})
           or a link action (value set: ${!!this.linkFunction})`);
        }
        descriptor = new ResourceDescriptorImpl(this.name, this.title, children, this.actions,
          (uri: string) => this.buildDescriptor(this.linkFunction(uri)) as ResourceDescriptor, this.fieldProcessor);
      } else {
        descriptor = new ObjectDescriptorImpl(this.name, this.title, children, this.fieldProcessor);
      }
    } else if (this.isType('association', !!this.association)) {
      descriptor = new AssociationDescriptorImpl(this.name, this.title, this.association, this.fieldProcessor);
    } else {
      if (this.type !== 'primitive') {
        LOGGER.warn(`Type 'primitive' was auto-guessed in ${this.mapperName}. Try to set type explicitly.`);
      }
      descriptor = new PropertyDescriptorImpl(this.name, this.title, this.fieldProcessor);
    }
    if (this.logResult) {
      LOGGER.debug(this.mapperName + ' -> ' + JSON.stringify(descriptor));
    }
    return descriptor;
  }

  private isType(type: DescriptorType, guess?: boolean) {
    if (this.type) {
      if (guess === false) {
        LOGGER.warn(`The auto-guess for type ${type} is not as expected in ${this.mapperName}.
        Try to provide all properties of this type.`);
      }
      return this.type === type;
    }
    if (guess) {
      LOGGER.warn(`Type ${type} was auto-guessed in ${this.mapperName}. Try to set type explicitly.`);
      return true;
    }
    return false;
  }

  private buildDescriptor(value: T): PropDescriptor {
    return this.builderFunction(value).toDescriptor();
  }

  private buildDescriptors(children: Array<T>): PropDescriptor[] {
    return children.map(c => this.buildDescriptor(c));
  }
}
