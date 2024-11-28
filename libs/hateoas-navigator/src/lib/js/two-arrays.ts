import {TwoAny} from './two-any';
import {DescriptorMapper} from "../hal-navigator/descriptor/mapper/descriptor-mapper";

export class TwoArrays {
  constructor(private a1: Array<DescriptorMapper<any>> | null, private a2: Array<DescriptorMapper<any>> | null) {
  }

  areEqual(): boolean {
    if (this.a1!.length === this.a2!.length) {
      for (let i = 0; i < this.a1!.length; i++) {
        if (!new TwoAny(this.a1![i], this.a2![i]).areEqual()) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}
