import { type LinkProps } from 'next/link';
import { type PropsWithChildren } from 'react';

export function mockNextLink() {
  jest.mock(
    'next/link',
    () =>
      ({ children, href, passHref }: PropsWithChildren<LinkProps>) => {
        const React = jest.requireActual('react');
        const URL = jest.requireActual('url');

        const url = href ? URL.format(href).toString() : undefined;

        return React.cloneElement(children, {
          href: (passHref && url) || undefined,
        });
      },
  );
}
