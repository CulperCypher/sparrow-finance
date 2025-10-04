import { publicProvider } from '@starknet-react/core';
import { sepolia, mainnet } from '@starknet-react/chains';
import { InjectedConnector } from 'starknetkit/injected';

export const connectors = [
  new InjectedConnector({ options: { id: 'argentX' } }),
  new InjectedConnector({ options: { id: 'braavos' } }),
];

export const starknetChains = [mainnet, sepolia];
export const starknetProviders = publicProvider();
