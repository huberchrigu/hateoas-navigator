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
