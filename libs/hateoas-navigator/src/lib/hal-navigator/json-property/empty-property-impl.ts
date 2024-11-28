import {GenericPropertyDescriptor} from '../descriptor';
import {AbstractProperty} from './abstract-property';
import {EmptyProperty} from './generic-property';

export class EmptyPropertyImpl<D extends GenericPropertyDescriptor> extends AbstractProperty<empty, D> implements EmptyProperty<D> {

  constructor(name: string, value: empty, descriptor: D | null) {
    super(name, value, descriptor);
  }

  getDisplayValue(): number | null | string {
    return '';
  }

  getFormValue(): any {
    return this.getValue();
  }
}

type empty = null | undefined;
