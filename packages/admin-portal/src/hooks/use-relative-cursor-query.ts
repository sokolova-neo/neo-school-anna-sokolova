import { useCallback, useMemo, useReducer } from 'react';

export enum RelativeCursorQueryValueType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  OBJECT_ID = 'OBJECT_ID',
  BOOLEAN = 'BOOLEAN',
  NULL = 'NULL',
}
export enum RelativeCursorQueryFilterOperator {
  EQ = 'EQ',
  NE = 'NE',
  LT = 'LT',
  LTE = 'LTE',
  IN = 'IN',
  NIN = 'NIN',
  GT = 'GT',
  GTE = 'GTE',
}

export interface RelativeCursorQueryFilterInput {
  field: string;
  operator: RelativeCursorQueryFilterOperator;
  type: RelativeCursorQueryValueType;
  value?: string;
  values?: string[];
}

export enum RelativeCursorQuerySortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface RelativeQueryCursorInput {
  field: string;
  type: RelativeCursorQueryValueType;
  sort: RelativeCursorQuerySortDirection;
  cursor?: string;
}

export interface RelativeCursorQueryInput {
  filter?: RelativeCursorQueryFilterInput[];
  primaryCursor: RelativeQueryCursorInput;
  secondaryCursor?: RelativeQueryCursorInput;
  limit?: number;
}

export interface RelativeQueryCursorResult {
  cursor?: string;
  field: string;
  sort: RelativeCursorQuerySortDirection;
  type: RelativeCursorQueryValueType;
}
export interface RelativeCursorQueryResultList<T> {
  results: T[];
  hasNextPage: boolean;
  primaryCursor?: RelativeQueryCursorResult;
  secondaryCursor?: RelativeQueryCursorResult;
}

export interface RelativeCursorQueryFilter {
  field: string;
  type: RelativeCursorQueryValueType;
  value?: string;
  values?: string[];
  operator: RelativeCursorQueryFilterOperator;
}

export interface RelativeCursorQuerySort {
  field: string;
  ascending: boolean;
}

interface RelativeCursorQueryCursor {
  field: string;
  type: RelativeCursorQueryValueType;
  sort: RelativeCursorQuerySortDirection;
  cursor?: string;
}

export interface InitialRelativeCursorQueryValue {
  filter: RelativeCursorQueryFilter[];
  primaryCursor: RelativeCursorQueryCursor;
  secondaryCursor?: RelativeCursorQueryCursor;
  limit: number;
}

interface State {
  filter: RelativeCursorQueryFilter[];
  primaryCursor: RelativeCursorQueryCursor;
  secondaryCursor?: RelativeCursorQueryCursor;
  primaryCursorSortDirection: RelativeCursorQuerySortDirection;
  secondaryCursorSortDirection?: RelativeCursorQuerySortDirection;
  limit: number;
}

type Action =
  | {
      type: 'setFilter';
      value: {
        filter: RelativeCursorQueryFilter[];
        primaryCursor: RelativeCursorQueryCursor;
        secondaryCursor?: RelativeCursorQueryCursor;
      };
    }
  | {
      type: 'setCursor';
      value: {
        primaryCursor: RelativeCursorQueryCursor;
        secondaryCursor?: RelativeCursorQueryCursor;
      };
    }
  | {
      type: 'setCursorSortDirection';
      value: {
        primaryCursorSortDirection: RelativeCursorQuerySortDirection;
        secondaryCursorSortDirection?: RelativeCursorQuerySortDirection;
      };
    }
  | {
      type: 'setLimit';
      value: {
        limit: number;
        primaryCursor: RelativeCursorQueryCursor;
        secondaryCursor?: RelativeCursorQueryCursor;
      };
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setFilter': {
      const primaryCursor = {
        ...action.value.primaryCursor,
        sort: state.primaryCursorSortDirection,
      };
      const secondaryCursor = action.value.secondaryCursor && {
        ...action.value.secondaryCursor,
        ...(state.secondaryCursorSortDirection && {
          sort: state.secondaryCursorSortDirection,
        }),
      };

      return {
        ...state,
        filter: action.value.filter,
        primaryCursor,
        secondaryCursor,
      };
    }

    case 'setCursor': {
      return {
        ...state,
        primaryCursor: action.value.primaryCursor,
        secondaryCursor: action.value.secondaryCursor,
        primaryCursorSortDirection: action.value.primaryCursor.sort,
        secondaryCursorSortDirection: action.value.secondaryCursor?.sort,
      };
    }

    case 'setCursorSortDirection': {
      const primaryCursor = {
        ...state.primaryCursor,
        sort: action.value.primaryCursorSortDirection,
        cursor: undefined,
      };
      const secondaryCursor = action.value.secondaryCursorSortDirection &&
        state.secondaryCursor && {
          ...state.secondaryCursor,
          sort: action.value.secondaryCursorSortDirection,
          cursor: undefined,
        };

      return {
        ...state,
        primaryCursorSortDirection: action.value.primaryCursorSortDirection,
        secondaryCursorSortDirection: action.value.secondaryCursorSortDirection,
        primaryCursor,
        secondaryCursor,
      };
    }

    case 'setLimit': {
      const primaryCursor = {
        ...action.value.primaryCursor,
        sort: state.primaryCursorSortDirection,
      };
      const secondaryCursor = action.value.secondaryCursor && {
        ...action.value.secondaryCursor,
        ...(state.secondaryCursorSortDirection && {
          sort: state.secondaryCursorSortDirection,
        }),
      };

      return {
        ...state,
        limit: action.value.limit,
        primaryCursor,
        secondaryCursor,
      };
    }

    default: {
      return state;
    }
  }
};

export interface UseRelativeCursorQueryReturnValues {
  relativeCursorQuery: RelativeCursorQueryInput;
  filter: RelativeCursorQueryFilter[];
  primaryCursor: RelativeCursorQueryCursor;
  secondaryCursor?: RelativeCursorQueryCursor;
  limit: number;
  setFilter: (filter: RelativeCursorQueryFilter[]) => void;
  setCursor: ({
    primaryCursor,
    secondaryCursor,
  }: {
    primaryCursor: RelativeCursorQueryCursor;
    secondaryCursor?: RelativeCursorQueryCursor;
  }) => void;
  setLimit: (limit: number) => void;
  setCursorSortDirection: ({
    primaryCursorSortDirection,
    secondaryCursorSortDirection,
  }: {
    primaryCursorSortDirection: RelativeCursorQuerySortDirection;
    secondaryCursorSortDirection?: RelativeCursorQuerySortDirection;
  }) => void;
}

const useRelativeCursorQuery = (
  initialValues: InitialRelativeCursorQueryValue,
): UseRelativeCursorQueryReturnValues => {
  const initialState = useMemo(
    () => ({
      filter: initialValues.filter,
      primaryCursor: initialValues.primaryCursor,
      secondaryCursor: initialValues.secondaryCursor,
      primaryCursorSortDirection: initialValues.primaryCursor.sort,
      secondaryCursorSortDirection: initialValues.secondaryCursor?.sort,
      limit: initialValues.limit,
    }),
    [
      initialValues.filter,
      initialValues.primaryCursor,
      initialValues.secondaryCursor,
      initialValues.limit,
    ],
  );

  const [{ filter, primaryCursor, secondaryCursor, limit }, dispatch] =
    useReducer(reducer, initialState);

  const setFilter = useCallback(
    (inputFilter: RelativeCursorQueryFilter[]): void => {
      dispatch({
        type: 'setFilter',
        value: {
          filter: inputFilter,
          primaryCursor: initialValues.primaryCursor,
          secondaryCursor: initialValues.secondaryCursor,
        },
      });
    },
    [initialValues.primaryCursor, initialValues.secondaryCursor],
  );

  const setCursor = useCallback(
    ({
      primaryCursor: primaryCursorInput,
      secondaryCursor: secondaryCursorInput,
    }: {
      primaryCursor: RelativeCursorQueryCursor;
      secondaryCursor?: RelativeCursorQueryCursor;
    }): void => {
      dispatch({
        type: 'setCursor',
        value: {
          primaryCursor: primaryCursorInput,
          secondaryCursor: secondaryCursorInput,
        },
      });
    },
    [],
  );

  const setCursorSortDirection = useCallback(
    ({
      primaryCursorSortDirection,
      secondaryCursorSortDirection,
    }: {
      primaryCursorSortDirection: RelativeCursorQuerySortDirection;
      secondaryCursorSortDirection?: RelativeCursorQuerySortDirection;
    }) => {
      dispatch({
        type: 'setCursorSortDirection',
        value: { primaryCursorSortDirection, secondaryCursorSortDirection },
      });
    },
    [],
  );

  const setLimit = useCallback(
    (limitInput: number): void => {
      dispatch({
        type: 'setLimit',
        value: {
          limit: limitInput,
          primaryCursor: initialValues.primaryCursor,
          secondaryCursor: initialValues.secondaryCursor,
        },
      });
    },
    [initialValues.primaryCursor, initialValues.secondaryCursor],
  );

  const relativeCursorQuery = useMemo(
    () => ({
      filter,
      primaryCursor,
      secondaryCursor,
      limit,
    }),
    [filter, primaryCursor, secondaryCursor, limit],
  );

  return {
    relativeCursorQuery,
    filter,
    primaryCursor,
    secondaryCursor,
    limit,
    setFilter,
    setCursor,
    setCursorSortDirection,
    setLimit,
  };
};

export { useRelativeCursorQuery };
