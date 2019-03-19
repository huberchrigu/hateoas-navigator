import {FormFieldBuilder} from '../form/form-field-builder';
import {ResourceDescriptor} from './resource-descriptor';
import {Observable} from 'rxjs';
import {ResourceDescriptorProvider} from './provider/resource-descriptor-provider';

export interface PropDescriptor {

  /**
   * This is a title describing the property.
   * @returns <code>undefined</code> if the descriptor does not know the title.
   */
  getTitle(): string;

  /**
   * This is the resource or property name.
   */
  getName(): string;

  /**
   * Provides a form field provider, which can be extended by custom configuration.
   */
  toFormFieldBuilder(): FormFieldBuilder;

  /**
   * Convenience method that returns the function's result, if this descriptor is of the given type.
   * @param fct The function of T
   * @param args The function's arguments
   */
  orNull<T extends PropDescriptor, F extends keyof T>(fct: (T) => T[F], ...args: Parameters<ToFunction<T[F]>>):
    ReturnType<ToFunction<T[F]>>;

  orEmpty<T extends PropDescriptor>(fct: (T) => ArrayFunc<T>): Array<PropDescriptor>;
}

export type ArrayFunc<T> = (...args: any[]) => T[];
export type ToFunction<T> = T extends (...args: any[]) => any ? T : never;

export interface ObjectPropertyDescriptor extends PropDescriptor {
  /**
   * All child descriptors.
   * @returns <code>undefined</code> if the children are not known. An empty list if there are no children.
   */
  getChildDescriptors<T extends PropDescriptor>(): Array<T>;

  /**
   * The child property descriptor.
   * @returns <code>null</code> if there is no child.
   * <code>undefined</code> if the descriptor does not know its children.
   */
  getChildDescriptor<T extends PropDescriptor>(resourceName: string): T;
}

export interface AssociationPropertyDescriptor extends PropDescriptor {
  resolveResource(descriptorProvider: ResourceDescriptorProvider): Observable<ResourceDescriptor>;

  getResource(): ResourceDescriptor;

  getAssociatedResourceName(): string;
}

export interface ArrayPropertyDescriptor<T extends PropDescriptor> extends PropDescriptor {
  /**
   * Returns the descriptor of the array items.
   */
  getItemsDescriptor(): T;
}
