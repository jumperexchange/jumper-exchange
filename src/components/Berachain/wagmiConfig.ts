import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage, http } from "wagmi";

/**
 * @todo
 * Replace viem/chains with royco/constants
 */
// TODO corn chain is not found, fix it
import { sepolia, mainnet, arbitrum, base } from "viem/chains";

export const metadata = {
  name: "Royco",
  description:
    "Royco is a marketplace for exclusive incentives from the best projects.",
  // url: "http://localhost:3000", // origin must match your domain & subdomain
  url: "https://royco.org", // origin must match your domain & subdomain
  icons: ["/icon.png"],
};

// Create wagmiConfig
const chains = [
  mainnet,
  arbitrum,
  base,
  ...(process.env.NEXT_PUBLIC_FRONTEND_TYPE === "TESTNET" ? [sepolia] : []),
] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId: '1ce2b86020b67f63d71494567a750347',
  metadata,
  ssr: true,
  storage: createStorage({
    storage:
      typeof window !== "undefined" ? window.localStorage : cookieStorage,
  }),
  batch: {
    multicall: true,
  },
  // transports: {
  //   [mainnet.id]: http(),
  //   [sepolia.id]: http(
  //     "https://eth-sepolia.g.alchemy.com/v2/1loBE7C025PbFMLCiTAhbG3WrIqH0J1y"
  //   ),
  //   // [sepolia.id]: http(),
  //   [arbitrum.id]: http(),
  //   [arbitrumSepolia.id]: http(),
  // },
  // ...wagmiOptions, // Optional - Override createConfig parameters
});
