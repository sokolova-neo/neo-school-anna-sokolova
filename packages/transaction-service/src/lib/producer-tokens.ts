// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

enum ProducerTokens {
  TransactionCreatedProducer = 'TransactionCreatedProducer',
  TransactionInitiatedTaskProducer = 'TransactionInitiatedTaskProducer',
}

type ProducerTokensType = keyof typeof ProducerTokens | ProducerTokens;

export { ProducerTokens, ProducerTokensType };
