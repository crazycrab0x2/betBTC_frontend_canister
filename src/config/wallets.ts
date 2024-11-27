export interface Wallet {
  id: string
  name: string
  logo: string
  type: 'btc' | 'icp'
  link: string
}

export const btcWallets: Wallet[] = [
  {
    id: 'unisat',
    name: 'Unisat',
    logo: '/wallet/unisat.png',
    type: 'btc',
    link: 'https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo?hl=en'
  },
  {
    id: 'wizz',
    name: 'Wizz',
    logo: '/wallet/wizz.png',
    type: 'btc',
    link: 'https://chromewebstore.google.com/detail/wizz-wallet/ghlmndacnhlaekppcllcpcjjjomjkjpg?hl=en'
  },
  {
    id: 'okxwallet.bitcoin',
    name: 'OKX',
    logo: '/wallet/okx.png',
    type: 'btc',
    link: 'https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge?hl=en'
  }
]

export const icpWallets: Wallet[] = [
  {
    id: 'ii',
    name: 'Internet Identity',
    logo: '/wallet/ii.svg',
    type: 'icp',
    link: 'https://identity.ic0.app/'
  },
  {
    id: 'nfid',
    name: 'NFID',
    logo: '/nfid-logo.svg',
    type: 'icp',
    link: 'https://nfid.one/'
  },
  {
    id: 'plug',
    name: 'Plug',
    logo: '/wallet/plug.svg',
    type: 'icp',
    link: 'https://chromewebstore.google.com/detail/plug/cfbfdhimifdmdehjmkdobpcjfefblkjm?hl=en-US'
  },
  {
    id: 'bitfinity',
    name: 'Bitfinity',
    logo: '/wallet/bitfinity.svg',
    type: 'icp',
    link: 'https://chromewebstore.google.com/detail/bitfinity-wallet/jnldfbidonfeldmalbflbmlebbipcnle?hl=en'
  }
]

export const defaultWallet: Wallet = {
  id: 'XverseProviders',
  name: 'Xverse',
  logo: '/wallet/xverse.png',
  type: 'btc',
  link: 'https://chromewebstore.google.com/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg?hl=en'
}

export const wallets = { btc: btcWallets, icp: icpWallets }
