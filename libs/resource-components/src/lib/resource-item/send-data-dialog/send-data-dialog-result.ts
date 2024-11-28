export class SendDataDialogResult {
  constructor(public method: string | null, public body: object | null) {

  }

  isCancelled() {
    return !this.method;
  }
}
