export class AssociatedResourceListener {
  private associatedResourceName: string;

  notifyAssociatedResource(resourceName: string) {
    this.associatedResourceName = resourceName;
  }

  protected getAssociatedResourceName(): string {
    if (this.associatedResourceName) {
      return this.associatedResourceName;
    }
    throw new Error('The descriptor was not notified about the associated resource name yet!');
  }
}
