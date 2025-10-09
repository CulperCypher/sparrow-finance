import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { avalancheFuji } from 'wagmi/chains';

// Beam Testnet custom chain
const beamTestnet = {
  id: 13337,
  name: 'Beam Testnet',
  network: 'beam-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BEAM',
    symbol: 'BEAM',
  },
  rpcUrls: {
    default: { http: ['https://build.onbeam.com/rpc/testnet'] },
    public: { http: ['https://build.onbeam.com/rpc/testnet'] },
  },
  blockExplorers: {
    default: { name: 'Beam Explorer', url: 'https://subnets-test.avax.network/beam' },
  },
  testnet: true,
} as const;

export const config = getDefaultConfig({
  appName: 'Sparrow Finance',
  projectId: 'YOUR_PROJECT_ID', // Get free ID from https://cloud.walletconnect.com
  chains: [avalancheFuji, beamTestnet],
  ssr: false,
});
