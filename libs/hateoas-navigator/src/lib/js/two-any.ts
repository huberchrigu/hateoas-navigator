import {TwoObjects} from 'hateoas-navigator/js/two-objects';
import {TwoArrays} from 'hateoas-navigator/js/two-arrays';

export class TwoAny {
  constructor(private a: any, private b: any) {
  }

  areEqual(): boolean {
    if (this.a === this.b) {
      return true;
    }
    if (Array.isArray(this.a) && Array.isArray(this.b)) {
      return new TwoArrays(this.a, this.b).areEqual();
    }
    if (typeof this.a === 'object' && typeof this.b === 'object') {
      return new TwoObjects(this.a, this.b).areEqual();
    }
    return false;
  }
}
