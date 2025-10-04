export const CONTRACTS = {
  fuji: {
    spAVAX: '0xd5be2F451C0B1B8cA17Cc64a1f904405B8120c9B',
  },
  mainnet: {
    spAVAX: '', // Deploy to mainnet later
  },
  beamTestnet: {
    spBEAM: '0x21e9726d777400c5dcBF65cF595125B21359A1DD',
  },
} as const;

export const CHAIN_IDS = {
  fuji: 43113,
  mainnet: 43114,
  beamTestnet: 13337,
} as const;

export const RPC_URLS = {
  fuji: 'https://api.avax-test.network/ext/bc/C/rpc',
  mainnet: 'https://api.avax.network/ext/bc/C/rpc',
  beamTestnet: 'https://build.onbeam.com/rpc/testnet',
} as const;

export const EXPLORER_URLS = {
  fuji: 'https://testnet.snowtrace.io',
  mainnet: 'https://snowtrace.io',
  beamTestnet: 'https://subnets-test.avax.network/beam',
} as const;
