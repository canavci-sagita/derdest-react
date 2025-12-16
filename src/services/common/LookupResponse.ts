export class LookupResponse {
  value: number;
  label: string;

  constructor(value?: number, label?: string) {
    this.value = value ?? 0;
    this.label = label ?? "";
  }
}
