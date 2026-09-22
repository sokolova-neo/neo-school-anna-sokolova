import { type Province } from '../types/user';

export enum Timezone {
  MOUNTAIN_STANDARD_TIME = 'MST',
  MOUNTAIN_TIME = 'MT',
  PACIFIC_STANDARD_TIME = 'PST',
  PACIFIC_TIME = 'PT',
  CENTRAL_STANDARD_TIME = 'CST',
  CENTRAL_TIME = 'CT',
  EASTERN_STANDARD_TIME = 'EST',
  EASTERN_TIME = 'ET',
  ATLANTIC_STANDARD_TIME = 'AST',
  ATLANTIC_TIME = 'AT',
  NEWFOUNDLAND_STANDARD_TIME = 'NST',
  NEWFOUNDLAND_TIME = 'NT',
}

const provinceTimezoneDefaults: { [key in Province]: Timezone } = {
  AB: Timezone.MOUNTAIN_TIME,
  BC: Timezone.PACIFIC_TIME,
  MB: Timezone.CENTRAL_TIME,
  NB: Timezone.ATLANTIC_TIME,
  NL: Timezone.NEWFOUNDLAND_TIME,
  NS: Timezone.ATLANTIC_TIME,
  NT: Timezone.MOUNTAIN_TIME,
  NU: Timezone.EASTERN_TIME,
  ON: Timezone.EASTERN_TIME,
  PE: Timezone.ATLANTIC_TIME,
  QC: Timezone.EASTERN_TIME,
  SK: Timezone.CENTRAL_STANDARD_TIME,
  YT: Timezone.PACIFIC_TIME,
};

export enum IanaStandardTimezoneCanada {
  'America/Blanc-Sablon' = 'America/Blanc-Sablon',
  'America/Glace_Bay' = 'America/Glace_Bay',
  'America/Goose_Bay' = 'America/Goose_Bay',
  'America/Halifax' = 'America/Halifax',
  'America/Moncton' = 'America/Moncton',
  'America/Dawson_Creek' = 'America/Dawson_Creek',
  'America/Creston' = 'America/Creston',
  'America/Fort_Nelson' = 'America/Fort_Nelson',
  'America/Cambridge_Bay' = 'America/Cambridge_Bay',
  'America/Edmonton' = 'America/Edmonton',
  'America/Inuvik' = 'America/Inuvik',
  'America/Yellowknife' = 'America/Yellowknife',
  'America/Atikokan' = 'America/Atikokan',
  'America/Iqaluit' = 'America/Iqaluit',
  'America/Nipigon' = 'America/Nipigon',
  'America/Pangnirtung' = 'America/Pangnirtung',
  'America/Thunder_Bay' = 'America/Thunder_Bay',
  'America/Toronto' = 'America/Toronto',
  'America/Rainy_River' = 'America/Rainy_River',
  'America/Rankin_Inlet' = 'America/Rankin_Inlet',
  'America/Resolute' = 'America/Resolute',
  'America/Winnipeg' = 'America/Winnipeg',
  'America/Regina' = 'America/Regina',
  'America/Swift_Current' = 'America/Swift_Current',
  'America/Dawson' = 'America/Dawson',
  'America/Vancouver' = 'America/Vancouver',
  'America/Whitehorse' = 'America/Whitehorse',
  'America/St_Johns' = 'America/St_Johns',
}

const timezoneGrouping: { [key in Timezone]: IanaStandardTimezoneCanada[] } = {
  MST: [
    IanaStandardTimezoneCanada['America/Dawson_Creek'],
    IanaStandardTimezoneCanada['America/Creston'],
    IanaStandardTimezoneCanada['America/Fort_Nelson'],
  ],
  MT: [
    IanaStandardTimezoneCanada['America/Edmonton'],
    IanaStandardTimezoneCanada['America/Cambridge_Bay'],
    IanaStandardTimezoneCanada['America/Inuvik'],
    IanaStandardTimezoneCanada['America/Yellowknife'],
  ],
  PST: [],
  PT: [
    IanaStandardTimezoneCanada['America/Vancouver'],
    IanaStandardTimezoneCanada['America/Dawson'],
    IanaStandardTimezoneCanada['America/Whitehorse'],
  ],
  CST: [
    IanaStandardTimezoneCanada['America/Regina'],
    IanaStandardTimezoneCanada['America/Swift_Current'],
  ],
  CT: [
    IanaStandardTimezoneCanada['America/Winnipeg'],
    IanaStandardTimezoneCanada['America/Rainy_River'],
    IanaStandardTimezoneCanada['America/Rankin_Inlet'],
    IanaStandardTimezoneCanada['America/Resolute'],
  ],
  EST: [IanaStandardTimezoneCanada['America/Atikokan']],
  ET: [
    IanaStandardTimezoneCanada['America/Toronto'],
    IanaStandardTimezoneCanada['America/Iqaluit'],
    IanaStandardTimezoneCanada['America/Nipigon'],
    IanaStandardTimezoneCanada['America/Pangnirtung'],
    IanaStandardTimezoneCanada['America/Thunder_Bay'],
  ],
  AST: [IanaStandardTimezoneCanada['America/Blanc-Sablon']],
  AT: [
    IanaStandardTimezoneCanada['America/Halifax'],
    IanaStandardTimezoneCanada['America/Glace_Bay'],
    IanaStandardTimezoneCanada['America/Goose_Bay'],
    IanaStandardTimezoneCanada['America/Moncton'],
  ],
  NST: [],
  NT: [IanaStandardTimezoneCanada['America/St_Johns']],
};

const getTimezoneByProvince = (
  province: Province,
): IanaStandardTimezoneCanada => {
  const neoTimezone = provinceTimezoneDefaults[province];

  if (!neoTimezone) {
    throw new Error('Invalid province passed to getTimezoneByProvince');
  }

  return timezoneGrouping[neoTimezone][0];
};

const getTimezoneOffsetByProvince = (province: Province): string =>
  Intl.DateTimeFormat([], {
    timeZone: getTimezoneByProvince(province),
    timeZoneName: 'shortOffset',
  })
    .format(new Date())
    .split(',')[1];

export { getTimezoneByProvince, getTimezoneOffsetByProvince };
