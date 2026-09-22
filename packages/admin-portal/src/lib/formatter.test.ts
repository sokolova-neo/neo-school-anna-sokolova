import {
  formatName,
  formatPhone,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPercentage,
  formatPeriod,
  formatUrl,
  formatBasisPointsPercentage,
  stringValueOrNotApplicable,
} from './formatter';

describe('formatNameStartWithFirstName', (): void => {
  test('Undefined name', (): void => {
    const name = formatName(undefined, { lastNameFirst: false });

    expect(name).toEqual('');
  });

  test('No name', (): void => {
    const name = formatName({}, { lastNameFirst: false });

    expect(name).toEqual('');
  });

  test('Full name', (): void => {
    const name = formatName(
      {
        firstName: 'Nozomu',
        preferredName: 'Non',
        lastName: 'Koshirae',
      },
      { lastNameFirst: false },
    );

    expect(name).toEqual('Nozomu Non Koshirae');
  });

  test('Missing first name', (): void => {
    const name = formatName(
      {
        preferredName: 'Non',
        lastName: 'Koshirae',
      },
      { lastNameFirst: false },
    );

    expect(name).toEqual('Non Koshirae');
  });

  test('Missing last name', (): void => {
    const name = formatName(
      {
        firstName: 'Nozomu',
        preferredName: 'Non',
      },
      { lastNameFirst: false },
    );

    expect(name).toEqual('Nozomu Non');
  });

  test('Missing middle name', (): void => {
    const name = formatName(
      {
        firstName: 'Nozomu',
        lastName: 'Koshirae',
      },
      { lastNameFirst: false },
    );

    expect(name).toEqual('Nozomu Koshirae');
  });

  test('With language flag', (): void => {
    const name = formatName(
      {
        firstName: 'Nozomu',
        lastName: 'Koshirae',
      },
      { lastNameFirst: false, includeLanguageFlag: true },
    );

    expect(name).toEqual('Nozomu Koshirae');
  });
});

describe('formatNameStartWithLastName', (): void => {
  test('Undefined name', (): void => {
    const name = formatName(undefined, { lastNameFirst: false });

    expect(name).toEqual('');
  });

  test('No name', (): void => {
    const name = formatName({}, { lastNameFirst: true });

    expect(name).toEqual('');
  });

  test('Full name', (): void => {
    const name = formatName(
      {
        firstName: 'Nozomu',
        preferredName: 'Non',
        lastName: 'Koshirae',
      },
      { lastNameFirst: true },
    );

    expect(name).toEqual('Koshirae, Nozomu Non');
  });

  test('Missing first name', (): void => {
    const name = formatName(
      {
        preferredName: 'Non',
        lastName: 'Koshirae',
      },
      { lastNameFirst: true },
    );

    expect(name).toEqual('Koshirae, Non');
  });

  test('Missing last name', (): void => {
    const name = formatName(
      {
        firstName: 'Nozomu',
        preferredName: 'Non',
      },
      { lastNameFirst: true },
    );

    expect(name).toEqual('Nozomu Non');
  });

  test('Missing middle name', (): void => {
    const name = formatName(
      {
        firstName: 'Nozomu',
        lastName: 'Koshirae',
      },
      { lastNameFirst: true },
    );

    expect(name).toEqual('Koshirae, Nozomu');
  });

  test('With language flag', (): void => {
    const name = formatName(
      {
        firstName: 'Nozomu',
        lastName: 'Koshirae',
      },
      { lastNameFirst: true, includeLanguageFlag: true },
    );

    expect(name).toEqual('Koshirae, Nozomu');
  });
});

describe('Format phone', (): void => {
  test('No phone', (): void => {
    const phone = formatPhone(undefined);

    expect(phone).toEqual('');
  });

  test('10 digit phone number', (): void => {
    const phone = formatPhone('4035551234');

    expect(phone).toEqual('(403) 555-1234');
  });

  test('Fewer than 10 digis', (): void => {
    const phone = formatPhone('5551234');

    expect(phone).toEqual('5551234');
  });

  test('More than 10 digis', (): void => {
    const phone = formatPhone('14035551234');

    expect(phone).toEqual('14035551234');
  });
});

describe('formatDate', (): void => {
  test('Undefined date', (): void => {
    const result = formatDate(undefined, 'UTC');

    expect(result).toEqual('');
  });

  test('formats string given date Object', (): void => {
    const date = new Date('2019-05-22T21:42:55.122+00:00');

    const results = formatDate(date, 'UTC');

    expect(results).toMatch('May 22, 2019');
  });

  test('formats string given date string', (): void => {
    const date = '1957-07-11T00:00:00.000+00:00';

    const results = formatDate(date, 'UTC');

    expect(results).toMatch('July 11, 1957');
  });

  test('formats UTC date correctly', (): void => {
    const date = '2020-05-01T00:09:41.136Z';

    const results = formatDate(date, 'UTC');

    expect(results).toMatch('May 1, 2020');
  });

  test('formats GMT date correctly', (): void => {
    const date = '2020-05-01T00:09:41.136Z';

    const results = formatDate(date, 'GMT');

    expect(results).toMatch('May 1, 2020');
  });
});

describe('formatDateTime', (): void => {
  test('Undefined date', (): void => {
    const result = formatDateTime(undefined, 'UTC');

    expect(result).toEqual('');
  });

  test('formats string given date Object', (): void => {
    const date = new Date('2019-05-22T21:42:55.122+00:00');

    const results = formatDateTime(date, 'UTC');

    expect(results).toMatch('May 22, 2019 - 9:42PM');
  });

  test('formats string given date string', (): void => {
    const date = '1957-07-11T00:00:00.000+00:00';

    const results = formatDateTime(date, 'UTC');

    expect(results).toMatch('Jul 11, 1957 - 12:00AM');
  });

  test('formats UTC date correctly', (): void => {
    const date = '2020-05-01T00:09:41.136Z';

    const results = formatDateTime(date, 'UTC');

    expect(results).toMatch('May 1, 2020 - 12:09AM');
  });

  test('formats GMT date correctly', (): void => {
    const date = '2020-05-01T00:09:41.136Z';

    const results = formatDateTime(date, 'GMT');

    expect(results).toMatch('May 1, 2020 - 12:09AM');
  });
});

describe('formatCurrency', (): void => {
  describe('with includeCurrencySymbol set to true', () => {
    test('should return emtpy string with undefined cents', (): void => {
      const result = formatCurrency({ cents: undefined });

      expect(result).toEqual('');
    });

    test('should displays amount in Canadian dollar if no currency supplied', (): void => {
      const amountCents = 56423;

      const results = formatCurrency({
        cents: amountCents,
        includeCurrencySymbol: true,
      });

      expect(results).toMatch('$564.23');
    });

    test('should displays amount in Canadian dollars if CAD currency supplied', (): void => {
      const amountCents = 56423;

      const results = formatCurrency({
        cents: amountCents,
        currency: 'CAD',
        includeCurrencySymbol: true,
      });

      expect(results).toMatch('$564.23');
    });

    test('should displays amount in American if USD currency supplied', (): void => {
      const amountCents = 56423;

      const results = formatCurrency({
        cents: amountCents,
        currency: 'USD',
        includeCurrencySymbol: true,
      });

      expect(results).toMatch('$564.23');
    });

    test('should displays amount in Euros if EUR currency supplied', (): void => {
      const amountCents = 56423;

      const results = formatCurrency({
        cents: amountCents,
        currency: 'EUR',
        includeCurrencySymbol: true,
      });

      expect(results).toMatch('€564.23');
    });
  });
  describe('when includeCurrencySymbol is false', () => {
    test('should successfully remove the currency symbol when currency is not set', (): void => {
      const amountCents = 56423;

      const results = formatCurrency({
        cents: amountCents,
        includeCurrencySymbol: true,
      });

      expect(results).toMatch('564.23');
    });

    test('should successfully remove the currency symbol when currency is set to CAD', (): void => {
      const amountCents = 56423;

      const results = formatCurrency({
        cents: amountCents,
        currency: 'CAD',
        includeCurrencySymbol: true,
      });

      expect(results).toMatch('564.23');
    });

    test('should successfully remove the currency symbol when currency is set to USD', (): void => {
      const amountCents = 56423;

      const results = formatCurrency({
        cents: amountCents,
        currency: 'USD',
        includeCurrencySymbol: true,
      });

      expect(results).toMatch('564.23');
    });

    test('should successfully remove the currency symbol when currency is set to EUR', (): void => {
      const amountCents = 56423;

      const results = formatCurrency({
        cents: amountCents,
        currency: 'EUR',
        includeCurrencySymbol: true,
      });

      expect(results).toMatch('564.23');
    });
  });
});

describe('formatPercentage', (): void => {
  test('Undefined amount', (): void => {
    const result = formatPercentage(undefined);

    expect(result).toEqual('');
  });

  test('No decimalPlaces formats intelligently', (): void => {
    const result = formatPercentage(0.1999);

    expect(result).toEqual('19.99%');
  });

  test('Providing the expected decimalPlaces formats correctly', (): void => {
    const result = formatPercentage(0.1999, 2);

    expect(result).toEqual('19.99%');
  });

  test('Providing more than the expected decimalPlaces pads with zeroes', (): void => {
    const result = formatPercentage(0.1999, 4);

    expect(result).toEqual('19.9900%');
  });

  test('Providing fewer than the expected decimalPlaces rounds the value', (): void => {
    const result = formatPercentage(0.1999, 1);

    expect(result).toEqual('20.0%');
  });

  test('No decimalPlaces after arithmetic defaults to 2 decimals', (): void => {
    const result = formatPercentage(0.1 + 0.2, undefined);

    expect(result).toEqual('30.00%');
  });

  test('Providing decimalPlaces after arithmetic formats as expected', (): void => {
    const result = formatPercentage(0.1 + 0.2, 0);

    expect(result).toEqual('30%');
  });
});

describe('formatBasisPointsPercentage', (): void => {
  test('Undefined amount', (): void => {
    const result = formatBasisPointsPercentage(undefined);

    expect(result).toEqual('');
  });

  test('No formatBasisPointsPercentage formats intelligently', (): void => {
    const result = formatBasisPointsPercentage(499);

    expect(result).toEqual('4.99%');
  });

  test('Providing the expected formatBasisPointsPercentage formats correctly', (): void => {
    const result = formatBasisPointsPercentage(499, 2);

    expect(result).toEqual('4.99%');
  });

  test('Providing more than the expected decimalPlaces pads with zeroes', (): void => {
    const result = formatBasisPointsPercentage(499, 4);

    expect(result).toEqual('4.9900%');
  });

  test('Providing fewer than the expected decimalPlaces rounds the value', (): void => {
    const result = formatBasisPointsPercentage(499, 1);

    expect(result).toEqual('5.0%');
  });

  test('No decimalPlaces after arithmetic defaults to 2 decimals', (): void => {
    const result = formatBasisPointsPercentage(499 + 499, undefined);

    expect(result).toEqual('9.98%');
  });

  test('Providing decimalPlaces after arithmetic formats as expected', (): void => {
    const result = formatBasisPointsPercentage(499 + 499, 0);

    expect(result).toEqual('10%');
  });
});

describe('formatPeriod', () => {
  test('less than one month', () => {
    const result = formatPeriod('2020-03-15', '2020-03-18');

    expect(result).toEqual('less than 1 month');
  });

  test('exactly one month', () => {
    const result = formatPeriod('2020-03-15', '2020-04-15');

    expect(result).toEqual('1 month');
  });

  test('just under 2 months', () => {
    const result = formatPeriod('2020-06-15', '2020-08-14');

    expect(result).toEqual('1 month');
  });

  test('just over 6 months', () => {
    const result = formatPeriod('2020-02-15', '2020-08-16');

    expect(result).toEqual('6 months');
  });

  test('more than one year', () => {
    const result = formatPeriod('2020-02-15', '2021-07-23');

    expect(result).toEqual('1 year and 5 months');
  });
});

describe('formatUrl', () => {
  const formatUrlHappyTests = [
    ['should format http when no http provided', 'test.com', 'http://test.com'],
    [
      'should not add http when http provided',
      'http://wwww.test.com',
      'http://wwww.test.com',
    ],
    [
      'should not add http when https provided',
      'https://wwww.test.com',
      'https://wwww.test.com',
    ],
    ['should not add http when empty string provided', '', ''],
    ['should not add http when a single space provided', ' ', ' '],
    ['should not add http when an end line provided', '\n', '\n'],
  ];

  describe.each(formatUrlHappyTests)(`formatUrl`, (a, b, expected) => {
    test(`${a}`, () => {
      const result = formatUrl(b);

      expect(result).toEqual(expected);
    });
  });
  test('should throw if undefined is given', () => {
    expect(() => {
      formatUrl(undefined as unknown as string);
    }).toThrow();
  });
});

describe('stringValueOrNotApplicable', () => {
  test('should return string value for a non-empty string input', () => {
    const result = stringValueOrNotApplicable('non-empty');

    expect(result).toBe('non-empty');
  });

  test('should return string value for a number input', () => {
    const result = stringValueOrNotApplicable(0);

    expect(result).toBe('0');
  });

  test.each([
    ['undefined', undefined],
    ['null', null],
    ['empty string', ''],
  ])('should return "N/A" with an input of %s', (_, input) => {
    const result = stringValueOrNotApplicable(input);

    expect(result).toBe('N/A');
  });
});
