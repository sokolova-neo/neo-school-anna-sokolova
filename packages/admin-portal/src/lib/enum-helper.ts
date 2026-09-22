const enumFromKeyString = <T extends Record<string, string>>(
  key: string,
  _enum: T,
): T[keyof T] => {
  const member = (_enum[key] as T[keyof T]) || undefined;

  if (member) {
    return member;
  }

  throw new Error(`Failed to get enum from string ${key}`);
};

const enumFromValueString = <T extends Record<string, string>>(
  value: string,
  _enum: T,
): T[keyof T] => {
  const member =
    (Object.values(_enum).find(
      (enumValue) => enumValue === value,
    ) as T[keyof T]) || undefined;

  if (member) {
    return member;
  }

  throw new Error(`Failed to get enum from string ${value}`);
};

export { enumFromKeyString, enumFromValueString };
