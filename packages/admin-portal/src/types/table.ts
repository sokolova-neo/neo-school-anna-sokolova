export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export interface Column<T> {
  key: keyof T;
  label: string;
  type: ColumnType;
}

export enum ColumnType {
  DATE = 'DATE',
  NUMERIC = 'NUMERIC',
  CENTS = 'CENTS',
  TEXT = 'TEXT',
}
