import {FormFieldBuilder} from '../form';
import {ResourceObjectDescriptor} from './resource-object-descriptor';
import {Observable} from 'rxjs';
import {ResourceDescriptorProvider} from './provider/resource-descriptor-provider';
import apply = Reflect.apply;

/**
 * A descriptor provides the scheme/metadata for a property within a resource object.
 * It is not related to property values.
 *
 * <i>Naming</i>: The interface name is chosen to not confuse with {@link PropertyDescriptor}.
 *
 * <i>For each property:</i> If it is not known, <code>undefined</code> is returned.
 */
export interface GenericPropertyDescriptor {

  /**
   * This is a title describing the property.
   * @returns <code>undefined</code> if the descriptor does not know the title.
   */
  getTitle(): string | undefined;

  /**
   * This is the resource or property name.
   */
  getName(): string | null | undefined;

  /**
   * Provides a form field provider, which can be extended by custom configuration.
   */
  toFormFieldBuilder(): FormFieldBuilder;

  /**
   * Convenience method that returns the function's result, if this descriptor is of the given type.
   * @param fct The function of T
   * @param args The function's arguments
   */
  orNull<T extends GenericPropertyDescriptor, F extends keyof T>(fct: (name: T) => T[F], ...args: Array<Parameters<ToFunction<T[F]>>[number]>): ReturnType<ToFunction<T[F]>> | null;

  /**
   * Convenience method that returns the function's result, if this descriptor is of the given type.
   * @param fct The function of T
   * @return Empty array if other type
   */
  orEmpty<T extends GenericPropertyDescriptor>(fct: (name: T) => ArrayFunc<T>): Array<GenericPropertyDescriptor>;
}

export abstract class AbstractPropDescriptor implements GenericPropertyDescriptor {
  orNull<T extends GenericPropertyDescriptor, F extends keyof T>(fct: (name: T) => T[F], ...args: Array<Parameters<ToFunction<T[F]>>[number]>): ReturnType<ToFunction<T[F]>> | null {
    try {
      // @ts-ignore
      return apply(fct(this), this, args);
    } catch (e) {
      return null;
    }
  }

  orEmpty<T extends GenericPropertyDescriptor>(fct: (name: T) => ArrayFunc<T>): Array<GenericPropertyDescriptor> {
    try {
      // @ts-ignore
      return apply(fct(this), this, []);
    } catch (e) {
      return [];
    }
  }

  abstract getName(): string | null | undefined;

  abstract getTitle(): string | undefined;

  abstract toFormFieldBuilder(): FormFieldBuilder;
}

export type ArrayFunc<T> = (...args: any[]) => T[];
export type ToFunction<T> = T extends (...args: any[]) => any ? T : never;

export interface ObjectDescriptor extends GenericPropertyDescriptor {
  /**
   * All child descriptors.
   * @returns <code>undefined</code> if the children are not known. An empty list if there are no children.
   */
  getChildDescriptors<CHILDREN extends GenericPropertyDescriptor>(): Array<CHILDREN>;

  /**
   * The child property descriptor.
   * @returns <code>null</code> if there is no child.
   * <code>undefined</code> if the descriptor does not know its children.
   */
  getChildDescriptor<CHILDREN extends GenericPropertyDescriptor>(resourceName: string): CHILDREN;
}

export interface AssociationDescriptor extends GenericPropertyDescriptor {
  /**
   * Resolves the associated resource's descriptor.
   */
  resolveResource(descriptorProvider: ResourceDescriptorProvider): Observable<ResourceObjectDescriptor>;

  /**
   * Can be used to {@link resolveResource resolve the association alone} and then setting the resolved resource so
   * {@link getResource it can be reused}
   */
  setResolvedResource(associatedResourceDesc: ResourceObjectDescriptor): void;

  getResource(): ResourceObjectDescriptor;

  getAssociatedResourceName(): string;
}

export interface ArrayDescriptor extends GenericPropertyDescriptor {
  /**
   * Returns the descriptor of the array items.
   */
  getItemsDescriptor<D extends GenericPropertyDescriptor>(): D;
}
