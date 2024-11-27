import { useHelpers } from '@/composables/useHelpers'

const { nFormatter, convertSats2Btc } = useHelpers()

export const formatBTC = (btcAmount: number): string =>
  nFormatter(convertSats2Btc(Number(btcAmount)), 1)
export const formatBTC2USD = (btcAmount: number, btcPrice: number): string =>
  nFormatter(convertSats2Btc(Number(btcAmount) * btcPrice).toFixed(2), 1)
export const formatBTCAmount = (btcAmount: number): string =>
  btcAmount
    .toString()
    .split('')
    .reverse()
    .join('')
    .replace(/(\d{3})/g, '$1,')
    .replace(/,$/, '')
    .split('')
    .reverse()
    .join('')
