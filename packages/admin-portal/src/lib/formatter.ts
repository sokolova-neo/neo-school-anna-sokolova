import { parseISO, differenceInMonths } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';

import { type Province } from '../types/user';

interface UserDetails {
  firstName?: string;
  preferredName?: string;
  lastName?: string;
  province?: Province;
}

interface FormatNameOptions {
  lastNameFirst?: boolean;
  includeLanguageFlag?: boolean;
}

interface FormatCurrencyInput {
  cents?: number | null;
  currency?: string;
  includeCurrencySymbol?: boolean;
}

export const formatFirstLetterCapital = (value?: string | null): string => {
  if (!value) {
    return '';
  }

  const formatLowerCase = value.toLowerCase();
  const formattedString =
    formatLowerCase[0].toUpperCase() + formatLowerCase.slice(1);

  return formattedString;
};

const formatNameStartWithFirstName = (user?: UserDetails | null): string => {
  if (!user) {
    return '';
  }

  const { firstName, preferredName, lastName } = user;
  let fullName = firstName || '';

  if (preferredName) {
    fullName += ` ${preferredName}`;
  }

  if (lastName) {
    fullName += ` ${lastName}`;
  }

  if (!fullName) {
    return '';
  }

  return fullName.trim();
};

const formatNameStartWithLastName = (user?: UserDetails | null): string => {
  if (!user) {
    return '';
  }

  const { firstName, preferredName, lastName } = user;
  let fullName = lastName || '';

  if (fullName && (firstName || preferredName)) {
    fullName += ',';
  }

  if (firstName) {
    fullName += ` ${firstName}`;
  }

  if (preferredName) {
    fullName += ` ${preferredName}`;
  }

  if (!fullName) {
    return '';
  }

  return fullName.trim();
};

export const formatName = (
  user?: UserDetails | null,
  options?: FormatNameOptions,
): string => {
  const formattedName = options?.lastNameFirst
    ? formatNameStartWithLastName(user)
    : formatNameStartWithFirstName(user);

  return formattedName;
};

export const formatPhone = (phone?: string | null): string => {
  if (!phone) {
    return '';
  }

  return phone.length === 10
    ? phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
    : phone;
};

export const formatNumber = (value: number, digits = 0): string =>
  value.toLocaleString('en-CA', {
    style: 'decimal',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const formatCurrency = ({
  cents,
  currency = 'CAD',
  includeCurrencySymbol = true,
}: FormatCurrencyInput): string => {
  const enCaLocale = 'en-CA';

  if (cents === undefined || cents === null) {
    return '';
  }

  if (includeCurrencySymbol) {
    return (cents / 100).toLocaleString(enCaLocale, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
    });
  }

  const currencyFractionDigits = new Intl.NumberFormat(enCaLocale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  }).resolvedOptions().maximumFractionDigits;

  const value = (cents / 100).toLocaleString(enCaLocale, {
    minimumFractionDigits: currencyFractionDigits,
  });

  return value;
};

export const unformatCurrency = (amount: string): number => {
  const centsWithSign = amount.replace(/[^0-9-]/g, '');
  const multiplier = centsWithSign.startsWith('-') ? -1 : 1;
  const cents = Number(amount.replace(/\D/g, ''));

  if (Number.isNaN(cents)) {
    throw new TypeError(`Invalid value: ${amount}`);
  }

  return multiplier * cents;
};

export const formatDate = (
  date?: string | Date | number | null,
  timezone = 'GMT',
  dateFormat = 'MMMM d, yyyy',
): string => {
  if (!date) {
    return '';
  }

  const zonedDate = utcToZonedTime(date, timezone);

  return format(zonedDate, dateFormat, { timeZone: timezone });
};

export const formatDateTime = (
  date?: string | Date | number | null,
  timezone = 'GMT',
  dateFormat = 'MMM d, yyyy - h:mma',
): string => {
  if (!date) {
    return '';
  }

  const zonedDate = utcToZonedTime(date, timezone);

  return format(zonedDate, dateFormat, { timeZone: timezone });
};

/**
 *
 * @param {number | null | undefined} percent a percentage in decimal format
 * @param {number} decimalPlaces changes how many decimal places the percent value will have
 * @default 2
 * @returns {string} a percentage in string format: "XX.XX%"
 *
 * @example formatPercentage(0.1999) will render as 19.99%
 * @example formatPercentage(1.32) will render as 132.00%
 * @example formatPercentage(0.01, 0) will render as 1%
 */
export const formatPercentage = (
  percent?: number | null,
  decimalPlaces = 2,
): string => {
  if (percent === undefined || percent === null) {
    return '';
  }

  const value = percent * 100;

  return `${
    decimalPlaces != null && decimalPlaces >= 0
      ? value.toFixed(decimalPlaces)
      : value
  }%`;
};

export const formatBasisPointsPercentage = (
  basisPoints?: number | null,
  decimalPlaces = 2,
): string => {
  if (basisPoints === undefined || basisPoints === null) {
    return '';
  }

  const percentage = basisPoints / 100;

  return `${
    decimalPlaces != null && decimalPlaces >= 0
      ? percentage.toFixed(decimalPlaces)
      : percentage
  }%`;
};

export const formatAndSanitizeString = (value?: string): string => {
  if (!value) {
    return '';
  }

  return value.replace(/[_-]/g, ' ');
};

export const formatDateInput = (
  date?: string | Date | number | null,
): string => {
  if (!date) {
    return '';
  }

  return format(typeof date === 'string' ? parseISO(date) : date, 'yyyy-MM-dd');
};

const pluralizeStringIfGreaterThanOne = (word: string, count: number): string =>
  `${word}${count > 1 ? 's' : ''}`;

export const formatPeriod = (
  startDate?: string | Date | null | number,
  endDate?: string | Date | null | number,
): string => {
  if (!startDate || !endDate) {
    return '';
  }

  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  const diff = differenceInMonths(end, start);

  const yearsNumber = Math.floor(diff / 12);
  const monthsNumber = diff % 12;

  if (yearsNumber === 0 && monthsNumber === 0) {
    return 'less than 1 month';
  }

  const years =
    yearsNumber > 0
      ? `${yearsNumber} ${pluralizeStringIfGreaterThanOne('year', yearsNumber)}`
      : '';
  const months =
    monthsNumber > 0
      ? `${monthsNumber} ${pluralizeStringIfGreaterThanOne(
          'month',
          monthsNumber,
        )}`
      : '';

  return [years, months].filter(Boolean).join(' and ');
};

export const formatAMPM = (
  date?: string | number | Date | null | number,
): string => {
  if (!date) {
    return 'N/A';
  }

  const dateObject = new Date(date);

  // If the date object is invalid it
  // will return 'NaN' on getTime()
  // and NaN is never equal to itself.
  // eslint-disable-next-line no-self-compare
  if (dateObject.getTime() !== dateObject.getTime()) {
    return 'N/A';
  }

  return format(dateObject, "h:mmaaaaa'm'");
};

export const truncateString = (
  name: string,
  maxLength: number,
  trailer = '...',
): string => {
  if (name.length <= maxLength) {
    return name;
  }

  return name.slice(0, maxLength).concat(trailer);
};

export const snakeCaseToTitleCase = (snake = ''): string =>
  snake
    .split('_')
    .map((word) =>
      word.length > 0
        ? word[0].toUpperCase().concat(word.slice(1).toLowerCase())
        : word,
    )
    .join(' ');

/**
 * camelCaseToTitleCase pipe converts camelCase or other case "keys" to human readable values for making labels in the DOM.
 * This function should only be used for the DOM.
 * @param valStr - a camelCase value that should be converted
 */
export const camelCaseToTitleCase = (valStr: string): string => {
  if (typeof valStr !== 'string') {
    return valStr;
  }

  const split = valStr.split(/(?=[A-Z])/).join(' ');

  return split[0].toUpperCase() + split.slice(1);
};

export const formatUrl = (incoming: string): string => {
  const result =
    incoming.slice(0, 4) !== 'http' && incoming.trim()
      ? `http://${incoming}`
      : incoming;

  return result;
};

export const stringValueOrNotApplicable = (
  value?: string | number | null,
): string => {
  if (value || typeof value === 'number') {
    return String(value);
  }

  return 'N/A';
};
