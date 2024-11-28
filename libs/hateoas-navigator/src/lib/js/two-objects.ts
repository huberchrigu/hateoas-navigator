import {TwoAny} from './two-any';

export class TwoObjects {
  constructor(private o1: object, private o2: object) {

  }

  areEqual(): boolean {
    const keys1 = Object.keys(this.o1);
    const keys2 = Object.keys(this.o2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    // @ts-ignore
    return !keys1.some(key => !new TwoAny(this.o1[key], this.o2[key]).areEqual());
  }
}
