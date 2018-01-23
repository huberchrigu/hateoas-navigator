import {AlpsDocument} from '@hal-navigator/alps-document/alps-document';
import {AlpsDescriptorAdapter} from '@hal-navigator/alps-document/alps-descriptor-adapter';

export class AlpsDocumentAdapter {
  private static readonly REPRESENTATION_POSTFIX = '-representation';

  constructor(private alpsDocument: AlpsDocument) {
  }

  /**
   * Assume that the representation of this resource has an ID ending
   * with '-representation'.
   * @returns {AlpsDescriptorAdapter[]}
   */
  getRepresentationDescriptor(): AlpsDescriptorAdapter {
    const representation = this.alpsDocument.alps.descriptors.find(d => d.id.endsWith(AlpsDocumentAdapter.REPRESENTATION_POSTFIX));
    return new AlpsDescriptorAdapter(representation);
  }

  getAllDescriptors() {
    return this.alpsDocument.alps.descriptors.map(d => new AlpsDescriptorAdapter(d));
  }
}
