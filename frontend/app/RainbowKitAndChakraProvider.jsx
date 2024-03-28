'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { ChakraProvider } from '@chakra-ui/react'
import {
    RainbowKitProvider, darkTheme,
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

//import { sepolia } from '@/utils/sepolia';
import { hardhat } from 'wagmi/chains';

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
  chains: [hardhat],
  ssr: true,
});

const queryClient = new QueryClient();

const RainbowKitAndChakraProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
                                  accentColor: '#CBC49B',
                                  accentColorForeground: 'black',
                                  borderRadius: 'small',
                                  fontStack: 'system',
                                  overlayBlur: 'small',
                                })}>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default RainbowKitAndChakraProvider