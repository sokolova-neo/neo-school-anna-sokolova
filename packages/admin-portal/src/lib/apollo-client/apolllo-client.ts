import { ApolloClient, type NormalizedCacheObject } from '@apollo/client';

export class SerializableApolloClient extends ApolloClient<NormalizedCacheObject> {
  // eslint-disable-next-line class-methods-use-this
  toJSON(): null {
    return null;
  }
}
