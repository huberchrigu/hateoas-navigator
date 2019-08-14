import {TwoAny} from 'hateoas-navigator/js/two-any';

export class TwoObjects {
  constructor(private o1: Object, private o2: Object) {

  }

  areEqual(): boolean {
    const keys1 = Object.keys(this.o1);
    const keys2 = Object.keys(this.o2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    return !keys1.some(key => !new TwoAny(this.o1[key], this.o2[key]).areEqual());
  }
}
