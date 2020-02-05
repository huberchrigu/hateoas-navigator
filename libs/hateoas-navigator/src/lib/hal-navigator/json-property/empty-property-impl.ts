import {GenericPropertyDescriptor} from '../descriptor';
import {AbstractProperty} from './abstract-property';
import {EmptyProperty} from 'hateoas-navigator/hal-navigator/json-property/generic-property';

export class EmptyPropertyImpl<D extends GenericPropertyDescriptor> extends AbstractProperty<empty, D> implements EmptyProperty<D> {

  constructor(name: string, value: empty, descriptor: D) {
    super(name, value, descriptor);
  }

  getDisplayValue(): string | number {
    return '';
  }

  getFormValue(): any {
    return this.getValue();
  }
}

type empty = null | undefined;
