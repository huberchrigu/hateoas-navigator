import {TwoAny} from 'hateoas-navigator/js/two-any';

export class TwoArrays {
  constructor(private a1: Array<any>, private a2: Array<any>) {
  }

  areEqual(): boolean {
    if (this.a1.length === this.a2.length) {
      for (let i = 0; i < this.a1.length; i++) {
        if (!new TwoAny(this.a1[i], this.a2[i]).areEqual()) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}
