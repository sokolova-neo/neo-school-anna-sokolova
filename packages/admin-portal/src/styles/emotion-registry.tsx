'use client';

import { useServerInsertedHTML } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import createCache from '@emotion/cache';
import { CacheProvider as DefaultCacheProvider } from '@emotion/react';

import {
  type EmotionCache,
  type Options as OptionsOfCreateCache,
} from '@emotion/cache';

export type NextAppDirEmotionCacheProviderProps = {
  options: Omit<OptionsOfCreateCache, 'insertionPoint'>;
  CacheProvider?: (props: {
    value: EmotionCache;
    children: ReactNode;
  }) => JSX.Element | null;
  children: ReactNode;
};

export function EmotionRegistry({
  options,
  CacheProvider = DefaultCacheProvider,
  children,
}: NextAppDirEmotionCacheProviderProps): JSX.Element {
  const [{ cache, flush }] = useState(() => {
    const emotionCache = createCache(options);
    emotionCache.compat = true;
    const prevInsert = emotionCache.insert;
    let inserted: string[] = [];
    emotionCache.insert = (...args) => {
      const serialized = args[1];
      if (emotionCache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flushCb = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache: emotionCache, flush: flushCb };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    names.forEach((name) => {
      styles += cache.inserted[name];
    });
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
