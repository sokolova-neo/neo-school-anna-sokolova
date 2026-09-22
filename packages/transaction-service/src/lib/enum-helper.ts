import { InvalidRequestError } from '@neofinancial/neo-framework';

const enumFromKeyString = <T extends Record<string, string>>(key: string, _enum: T): T[keyof T] => {
  const member = (_enum[key] as T[keyof T]) || undefined;

  if (member) {
    return member;
  }

  throw new InvalidRequestError(`Failed to get enum from string ${key}`, {
    logData: {
      object: { key, enumKeys: Object.keys(_enum) },
    },
  });
};

const enumFromValueString = <T extends Record<string, string>>(value: string, _enum: T): T[keyof T] => {
  const member = (Object.values(_enum).find((enumValue) => enumValue === value) as T[keyof T]) || undefined;

  if (member) {
    return member;
  }

  throw new InvalidRequestError(`Failed to get enum from string ${value}`, {
    logData: {
      object: { value, enumKeys: Object.values(_enum) },
    },
  });
};

export { enumFromKeyString, enumFromValueString };
