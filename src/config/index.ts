export * from './wallets'

export const IS_DEVELOPMENT = import.meta.env.VITE_IS_DEVELOPMENT === 'true'

export type EnvironmentId = 'local' | 'integration' | 'staging' | 'production'

export type Environment = {
  id: EnvironmentId
  name: string
  VITE_DFX_NETWORK: 'ic' | 'local'
  VITE_CANISTER_ID_BACKEND: string
  VITE_CANISTER_ID_SIWB_PROVIDER: string
  VITE_CANISTER_ID_CKBTC_MINTER: string
  VITE_CANISTER_ID_CKBTC_LEDGER: string
}

export const environments: Environment[] = [
  {
    id: 'local',
    name: 'Local',
    VITE_DFX_NETWORK: import.meta.env.VITE_DFX_NETWORK,
    VITE_CANISTER_ID_BACKEND: import.meta.env.VITE_CANISTER_ID_BACKEND,
    VITE_CANISTER_ID_SIWB_PROVIDER: import.meta.env.VITE_CANISTER_ID_SIWB_PROVIDER,
    VITE_CANISTER_ID_CKBTC_MINTER: import.meta.env.VITE_CANISTER_ID_CKBTC_MINTER,
    VITE_CANISTER_ID_CKBTC_LEDGER: import.meta.env.VITE_CANISTER_ID_CKBTC_LEDGER
  },
  {
    id: 'integration',
    name: 'Integration',
    VITE_DFX_NETWORK: 'ic',
    VITE_CANISTER_ID_BACKEND: 'agm3q-baaaa-aaaak-akwbq-cai',
    VITE_CANISTER_ID_SIWB_PROVIDER: 'aw5qc-miaaa-aaaak-amupq-cai',
    VITE_CANISTER_ID_CKBTC_MINTER: 'ml52i-qqaaa-aaaar-qaaba-cai',
    VITE_CANISTER_ID_CKBTC_LEDGER: 'mc6ru-gyaaa-aaaar-qaaaq-cai'
  },
  {
    id: 'staging',
    name: 'Staging',
    VITE_DFX_NETWORK: 'ic',
    VITE_CANISTER_ID_BACKEND: 'lplrg-giaaa-aaaao-qeyna-cai',
    VITE_CANISTER_ID_SIWB_PROVIDER: 'likxs-lqaaa-aaaao-qeynq-cai',
    VITE_CANISTER_ID_CKBTC_MINTER: 'mqygn-kiaaa-aaaar-qaadq-cai',
    VITE_CANISTER_ID_CKBTC_LEDGER: 'mxzaz-hqaaa-aaaar-qaada-cai'
  },
  {
    id: 'production',
    name: 'Production',
    VITE_DFX_NETWORK: 'ic',
    VITE_CANISTER_ID_BACKEND: 'xgajl-xqaaa-aaaak-ao2gq-cai',
    VITE_CANISTER_ID_SIWB_PROVIDER: '7pexh-5aaaa-aaaak-ao3rq-cai',
    VITE_CANISTER_ID_CKBTC_MINTER: 'mqygn-kiaaa-aaaar-qaadq-cai',
    VITE_CANISTER_ID_CKBTC_LEDGER: 'mxzaz-hqaaa-aaaar-qaada-cai'
  }
]

export const ENV_KEY = 'betBTC_env'

const currentEnvironmentId: EnvironmentId = IS_DEVELOPMENT
  ? (localStorage.getItem(ENV_KEY) ?? 'local')
  : import.meta.env.VITE_ENVIRONMENT

const environment = environments.find((env) => env.id === currentEnvironmentId)!

const DFX_HOST = environment.VITE_DFX_NETWORK === 'ic' ? 'https://ic0.app' : 'http://127.0.0.1:4943'

const IS_IN_PRODUCTION = environment.VITE_CANISTER_ID_BACKEND === 'xgajl-xqaaa-aaaak-ao2gq-cai'

const config = {
  ...environment,
  IS_IN_PRODUCTION,
  currentEnvironmentId,
  DFX_HOST,
  VITE_DISABLE_RECAPTCHA: import.meta.env.VITE_DISABLE_RECAPTCHA === 'true',
  VITE_CANISTER_ID_II: import.meta.env.VITE_CANISTER_ID_II
}

export default config
