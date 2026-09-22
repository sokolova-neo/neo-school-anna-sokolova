export interface User {
  id: string;
  firstName: string;
  preferredName?: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  status: UserStatus;
  province: Province;
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  FROZEN = 'FROZEN',
}

export enum RewardLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
}

export enum Province {
  AB = 'AB',
  BC = 'BC',
  MB = 'MB',
  NB = 'NB',
  NL = 'NL',
  NT = 'NT',
  NS = 'NS',
  NU = 'NU',
  ON = 'ON',
  PE = 'PE',
  QC = 'QC',
  SK = 'SK',
  YT = 'YT',
}
