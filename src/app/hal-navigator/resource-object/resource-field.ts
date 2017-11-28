export interface DataHolder {
  getDisplayValue(): string | number;
  getFormValue(): any;
  isUriType(): boolean;
}
