import { config } from './wagmi'

export function isChainIdSupported(id?: number) {
  return config.chains.find((c) => c.id === id) !== undefined
}
