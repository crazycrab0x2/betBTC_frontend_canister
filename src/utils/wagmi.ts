// import { http, createConfig, createStorage } from '@wagmi/vue'
// import { mainnet, optimism, sepolia } from '@wagmi/vue/chains'
// import { coinbaseWallet, walletConnect, metaMask } from '@wagmi/vue/connectors'

// export const config = createConfig({
//   chains: [mainnet, sepolia, optimism],
//   connectors: [
//     walletConnect({
//       projectId: "c21e05b320fb7f35cfef1164ac850e33",
//     }),
//     coinbaseWallet({ appName: 'BetBTC', darkMode: true }),
//     metaMask({ dappMetadata: {
//       url: "https://www.betbtc.win",
//       name: "BetBTC",
//       iconUrl: "https://www.betbtc.win/Logomark.svg"
//     } })
//   ],
//   storage: createStorage({ storage: localStorage, key: 'vite-vue' }),
//   transports: {
//     [mainnet.id]: http(),
//     [sepolia.id]: http(),
//     [optimism.id]: http(),
//   },
// })

// declare module '@wagmi/vue' {
//   interface Register {
//     config: typeof config
//   }
// }

import { createConfig, http } from '@wagmi/vue'

import { mainnet } from '@wagmi/vue/chains'
import { walletConnect, metaMask } from '@wagmi/vue/connectors'

// Replace with your own WalletConnect project ID
// Register for free at https://walletconnect.com/
const WALLETCONNECT_PROJECT_ID = 'c21e05b320fb7f35cfef1164ac850e33'

export const config = createConfig({
  chains: [mainnet],
  connectors: [],
  transports: {
    [mainnet.id]: http()
  }
})
