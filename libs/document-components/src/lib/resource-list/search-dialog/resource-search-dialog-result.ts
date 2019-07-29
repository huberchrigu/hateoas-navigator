export class ResourceSearchDialogResult {
  constructor(public uri: string) {

  }

  isCancelled() {
    return !this.uri;
  }
}
