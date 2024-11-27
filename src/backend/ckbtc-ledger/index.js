import { Actor, HttpAgent } from '@dfinity/agent'

// Imports and re-exports candid interface
import { idlFactory } from './ckbtc.did.js'
export { idlFactory } from './ckbtc.did.js'

import config from '../../config'

/* CANISTER_ID is replaced by webpack based on node environment
 * Note: canister environment variable will be standardized as
 * process.env.CANISTER_ID_<CANISTER_NAME_UPPERCASE>
 * beginning in dfx 0.15.0
 */

export const canisterId = config.VITE_CANISTER_ID_CKBTC_LEDGER

const DFX_NETWORK = config.VITE_DFX_NETWORK

const DFX_HOST = DFX_NETWORK === 'ic' ? 'https://ic0.app' : 'http://127.0.0.1:4943'

export const createActor = (canisterId, options = {}) => {
  const agent = options.agent || new HttpAgent({ ...options.agentOptions })

  if (options.agent && options.agentOptions) {
    console.warn(
      'Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.'
    )
  }
  // Fetch root key for certificate validation during development
  if (DFX_NETWORK !== 'ic') {
    agent.fetchRootKey().catch((err) => {
      console.warn('Unable to fetch root key. Check to ensure that your local replica is running')
      console.error(err)
    })
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  })
}

export const ckBtcLedger = canisterId
  ? createActor(canisterId, {
      agentOptions: {
        host: DFX_HOST
      }
    })
  : undefined