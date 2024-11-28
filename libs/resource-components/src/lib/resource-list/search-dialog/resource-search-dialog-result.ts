export class ResourceSearchDialogResult {
  constructor(public uri: string | null) {

  }

  isCancelled() {
    return !this.uri;
  }
}
