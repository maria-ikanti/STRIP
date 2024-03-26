'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { ChakraProvider } from '@chakra-ui/react'
import {
    RainbowKitProvider,
    getDefaultConfig,
    getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import {
    argentWallet,
    ledgerWallet,
    trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { sepolia } from '@/utils/sepolia';

const { wallets } = getDefaultWallets();

const WALLET_CONNECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT || "";

const config = getDefaultConfig({
  appName: "DefiStripAppli",
  projectId: WALLET_CONNECT_ID,
  wallets: [
      ...wallets,
      {
          groupName: "Other",
          wallets: [argentWallet, trustWallet, ledgerWallet],
      },
  ],
  chains: [sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

const RainbowKitAndChakraProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default RainbowKitAndChakraProvider