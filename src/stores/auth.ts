/* eslint-disable no-case-declarations */
import { defineStore, type PiniaPluginContext } from 'pinia'
import { Actor, type Identity } from '@dfinity/agent'
import { AuthClient } from '@dfinity/auth-client'
import { DelegationIdentity } from '@dfinity/identity'
// TODO: Move ./temp to @oranjlabs/siwb
import {
  siwbMachine,
  createActor as createSIWBActor,
  type WalletProviderKey as BTCWalletProviderKey
} from './temp'
import { useMachine } from '@xstate/vue'

import type { User } from '@/types/profileDataTypes'
import { SiwbStorage } from './temp/storage'
import { typeCastedBackendActor } from '@/backend/typeCastedBackend'
import { Principal } from '@dfinity/principal'
import { testAccounts, type TestAccountKeys } from '@/config/test-accounts'
import config from '@/config'

export const canisterId = config.VITE_CANISTER_ID_SIWB_PROVIDER

const actor = createSIWBActor(canisterId, {
  agentOptions: { host: config.DFX_HOST }
})
export const { send, actorRef: siwbActorRef } = useMachine(siwbMachine, {
  input: { anonymousActor: actor },
  inspect: (e) => console.debug(e)
})

siwbActorRef.start()

export type WalletAuthStatus =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'PREPARING'
  | 'SIGNING'
  | 'AUTHENTICATING'
  | 'AUTHENTICATED'
  | 'ERROR'

export type SupportedWallet = BTCWalletProviderKey | ICPWalletProviderKey
export type ICPWalletProviderKey = 'ii' | 'plug'
export type WalletProviderKey = BTCWalletProviderKey

const idleTimeout = 2 * 7 * 24 * 3600 * 1000 // 2 weeks in ms

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userPrincipal: null as string | null,
    profile: null as User | null,
    authClient: null as AuthClient | null,
    backendActor: typeCastedBackendActor,
    balance: 0,
    isLoadingBalance: false,
    isLoadingDepositAddresses: false,
    depositAddresses: {
      btc: null as string | null
    },
    btcAuthStatus: 'CONNECTING' as WalletAuthStatus,
    btcAuthError: null as string | null,
    connectedWalletKeys: [] as SupportedWallet[],
    isAdmin: false
  }),
  actions: {
    async setPrincipal(principal: string | null) {
      this.userPrincipal = principal
      if (principal) {
        this.isAdmin = await this.backendActor.is_admin(Principal.fromText(principal))
      }
    },
    setProfile(profile: User | null) {
      this.profile = profile
      this._update()
    },
    setAuthClient(client: AuthClient) {
      this.authClient = client
      this.setPrincipal(client.getIdentity().getPrincipal().toText())

      // DO NOT USE this.authClient.getIdentity() here as it is Proxy instance and cause error to access private fields
      // https://github.com/colinhacks/zod/issues/3520
      Actor.agentOf(this.backendActor as unknown as Actor)?.replaceIdentity?.(client.getIdentity())
    },
    setBalance(balance: number) {
      this.balance = balance
    },
    setBtcAuthStatus(status: WalletAuthStatus, error?: string) {
      this.btcAuthStatus = status
      this.btcAuthError = error ?? null
    },
    addConnectedWallet(providerKey: SupportedWallet) {
      if (this.connectedWalletKeys.includes(providerKey)) return
      // connectedWalletKeys size should be 3, remove the first one if it exceeds
      if (this.connectedWalletKeys.length >= 3) {
        this.connectedWalletKeys.pop()
      }
      this.connectedWalletKeys.unshift(providerKey)
    },
    async updateBalance() {
      if (!this.profile) return

      this.isLoadingBalance = true
      try {
        const before = Date.now()
        const balance = await this.backendActor.get_balance(this.profile.id)
        const after = Date.now()
        console.debug(`Fetched balance in ${after - before}ms`)
        this.balance = Number(balance)
      } catch (error) {
        console.error('updated balance error ===> ', error)
        this.balance = 0
      } finally {
        this.isLoadingBalance = false
      }
    },
    async getDepositAddresses() {
      if (!this.profile) return
      this.isLoadingDepositAddresses = true
      try {
        const result = await this.backendActor.deposit()
        // result[1] is error
        if ('Ok' in result) {
          this.depositAddresses.btc = result.Ok
        } else {
          throw new Error(result.Err)
        }
      } catch (error) {
        console.error('get diposit address =====>', error)
        this.depositAddresses.btc = null
      } finally {
        this.isLoadingDepositAddresses = false
      }
    },
    async _update() {
      this.updateBalance()
      this.getDepositAddresses()
    },
    async handleSignout() {
      this.setPrincipal(null)
      this.setProfile(null)
    },
    // Only test/dev purpose
    async handleTestAccountLogin(key: TestAccountKeys) {
      const identity = testAccounts.find((account) => account.name === key)?.identity

      if (!identity) {
        throw new Error(`Test account ${key} not found`)
      }

      const authClient = await AuthClient.create({
        identity,
        keyType: 'Ed25519',
        idleOptions: {
          idleTimeout,
          onIdle: () => this.setProfile(null)
        }
      })

      this.setAuthClient(authClient)

      return identity
    },
    async handleBtcLogin(providerKey: BTCWalletProviderKey) {
      send({ type: 'CONNECT', providerKey })
      const identity = await new Promise<DelegationIdentity>((resolve) => {
        siwbActorRef.on('AUTHENTICATED', (event) => {
          resolve(event.data)
        })
      })
      const authClient = await AuthClient.create({
        storage: new SiwbStorage(),
        keyType: 'Ed25519',
        idleOptions: {
          idleTimeout,
          onIdle: () => this.setProfile(null)
        }
      })

      this.setAuthClient(authClient)
      this.addConnectedWallet(providerKey)
      return identity
    },
    async handleIcpLogin(
      providerKey: ICPWalletProviderKey,
      handleAuth: (identity: Identity) => void
    ) {
      switch (providerKey) {
        case 'ii':
          const authClient = await AuthClient.create({
            keyType: 'Ed25519',
            idleOptions: {
              idleTimeout,
              onIdle: () => this.setProfile(null)
            }
          })
          const identityProvider = import.meta.env.VITE_CANISTER_ID_II
            ? `http://${import.meta.env.VITE_CANISTER_ID_II}.localhost:4943/`
            : 'https://identity.ic0.app'

          const derivationOrigin = import.meta.env.VITE_II_DERIVATION_ORIGIN ?? undefined
          this.addConnectedWallet(providerKey)
          await authClient.login({
            identityProvider,
            derivationOrigin,
            maxTimeToLive: BigInt(idleTimeout * 1000),
            onSuccess: async () => {
              this.setAuthClient(authClient)
              this.setBtcAuthStatus('AUTHENTICATED')
              return handleAuth(authClient.getIdentity())
            },
            onError: async (error) => {
              console.error('Login Failed:\n\n' + error)
              this.setBtcAuthStatus('ERROR', error)
            },
            windowOpenerFeatures: `
        left=${window.screen.width / 2 - 525 / 2},
        top=${window.screen.height / 2 - 705 / 2},
        toolbar=0,location=0,menubar=0,width=525,height=705`
          })
          break
        default:
          break
      }
    }
  },
  persist: {
    omit: ['authClient', 'btcAuthStatus', 'backendActor', 'isAdmin'],
    afterHydrate: async (context: PiniaPluginContext) => {
      siwbActorRef.on('*', (event) => {
        switch (event.type) {
          case 'CONNECTED':
            context.store.setBtcAuthStatus('PREPARING')
            break
          case 'DISCONNECTED':
            context.store.setBtcAuthStatus('DISCONNECTED')
            break
          case 'SIGN_DATA_PREPARED':
            context.store.setBtcAuthStatus('SIGNING')
            break
          case 'SIGNATURE_SETTLED':
            context.store.setBtcAuthStatus('AUTHENTICATING')
            break
          case 'AUTHENTICATED':
            context.store.setBtcAuthStatus('AUTHENTICATED')
            break
          case 'ERROR':
            context.store.setBtcAuthStatus('ERROR', event.data?.message ?? 'Unkown error')
            break
          default:
            // @ts-ignore
            console.log(`Unhandled event: ${event.type}`)
        }
      })
      const authClient = await AuthClient.create({
        keyType: 'Ed25519',
        idleOptions: {
          idleTimeout,
          onIdle: () => context.store.setProfile(null)
        }
      })
      const isAuthenticated = await authClient.isAuthenticated()
      if (!isAuthenticated) {
        context.store.handleSignout()
      }

      Actor.agentOf(context.store.$state.backendActor)?.replaceIdentity?.(authClient.getIdentity())
      context.store.$state.authClient = authClient

      if (context.store.$state.userPrincipal) {
        context.store.$state.isAdmin = await context.store.$state.backendActor.is_admin(
          Principal.fromText(context.store.$state.userPrincipal)
        )
      }
      await context.store._update()
    }
  }
})
