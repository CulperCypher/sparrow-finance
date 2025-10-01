export const CONTRACTS = {
  fuji: {
    spAVAX: '0x8F8926A38D03125c448b5EF5f2Edbfc3BE8C69D2',
  },
  mainnet: {
    spAVAX: '', // Deploy to mainnet later
  },
} as const;

export const CHAIN_IDS = {
  fuji: 43113,
  mainnet: 43114,
} as const;

export const RPC_URLS = {
  fuji: 'https://api.avax-test.network/ext/bc/C/rpc',
  mainnet: 'https://api.avax.network/ext/bc/C/rpc',
} as const;

export const EXPLORER_URLS = {
  fuji: 'https://testnet.snowtrace.io',
  mainnet: 'https://snowtrace.io',
} as const;
