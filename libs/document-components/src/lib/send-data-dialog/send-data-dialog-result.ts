export class SendDataDialogResult {
  constructor(public method: string, public body: object) {

  }

  isCancelled() {
    return !this.method;
  }
}
