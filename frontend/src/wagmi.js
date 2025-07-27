import { http, createStorage, cookieStorage } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { hardhat, sepolia } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'KrishiChain',
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  chains: [hardhat, sepolia],
  ssr: false,
  storage: createStorage({ storage: cookieStorage }),
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http(import.meta.env.VITE_ALCHEMY_SEPOLIA_RPC)
  }
});
