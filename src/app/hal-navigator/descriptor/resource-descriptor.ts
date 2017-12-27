/**
 * Describes the schema of a resource. This interface serves as an abstraction and can be implemented by
 * fetching this information from the backend or by static configuration.
 */
import {Observable} from 'rxjs/Observable';
import {FormField} from '@hal-navigator/schema/form/form-field';

export interface ResourceDescriptor {
  getTitle(): string;

  getName(): string;

  getChild(resourceName: string): ResourceDescriptor;

  getChildren(): Array<ResourceDescriptor>;

  resolveAssociation(): Observable<ResourceDescriptor>;

  toFormField(): FormField;
}
