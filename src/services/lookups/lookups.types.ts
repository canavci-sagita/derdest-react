import { LookupResponse } from "../common/LookupResponse";

export class CountryLookupResponse extends LookupResponse {
  countryCode: string;
  phoneCode: string;
  phoneFormat: string;

  constructor(
    value?: number,
    label?: string,
    countryCode?: string,
    phoneCode?: string,
    phoneFormat?: string
  ) {
    super(value, label);
    this.countryCode = countryCode ?? "";
    this.phoneCode = phoneCode ?? "";
    this.phoneFormat = phoneFormat ?? "";
  }
}

export class TimelineLookupResponse extends LookupResponse {
  date?: Date;

  constructor(value?: number, label?: string, date?: Date) {
    super(value, label);
    this.date = date;
  }
}

export class EvidenceLookupResponse extends LookupResponse {
  timeline?: string;

  constructor(value?: number, label?: string, timeline?: string) {
    super(value, label);
    this.timeline = timeline;
  }
}
