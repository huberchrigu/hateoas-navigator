import {AlpsDocument} from './alps-document';
import {AlpsDescriptorAdapter} from './alps-descriptor-adapter';
import {AlpsDescriptor} from 'hateoas-navigator/hal-navigator/alps-document/alps-descriptor';

export class AlpsDocumentAdapter {
  private static readonly REPRESENTATION_POSTFIX = '-representation';

  constructor(private alpsDocument: AlpsDocument) {
  }

  /**
   * Assume that the representation of this resource has an ID ending
   * with '-representation'.
   */
  getRepresentationDescriptor(): AlpsDescriptorAdapter {
    const representation = this.getDescriptors().find(d => d.id.endsWith(AlpsDocumentAdapter.REPRESENTATION_POSTFIX));
    return new AlpsDescriptorAdapter(representation);
  }

  getAllDescriptors() {
    return this.getDescriptors().map(d => new AlpsDescriptorAdapter(d));
  }

  private getDescriptors(): AlpsDescriptor[] {
    let alps = this.alpsDocument.alps;
    if (alps.descriptor) {
      return alps.descriptor;
    } else {
      throw new Error(`ALPS should provide one more descriptors, given by the property "descriptor". But it only contained 
      ${JSON.stringify(alps)}.
      If you use Spring HATEOAS, make sure that your version is >= 0.25.0.`);
    }
  }
}
