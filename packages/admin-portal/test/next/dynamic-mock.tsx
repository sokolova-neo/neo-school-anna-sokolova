import { ReactElement } from 'react';

const MockDynamicComponent = (): ReactElement => {
  return <div data-testid="dynamic"></div>;
};

export function mockNextDynamic() {
  return jest.mock('next/dynamic', () => () => MockDynamicComponent);
}
