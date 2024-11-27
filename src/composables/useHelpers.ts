import { validate } from 'bitcoin-address-validation'
import { Principal } from '@dfinity/principal'
import { DateTime, Duration } from 'luxon'

export const SATOSHIS_PER_BTC = 100000000

export const useHelpers = () => {
  const toggleBodyScroll = (enable = true) => {
    if (enable) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }

  const fetchBTCdata = async (): Promise<number> => {
    try {
      const response = await fetch('https://api.coincap.io/v2/assets')
      const result = await response.json()
      const bitcoinData = result.data.filter((coin: any) => coin.id == 'bitcoin')[0]
      return Number(Number(bitcoinData.priceUsd).toFixed(2))
    } catch (error) {
      return 0
    }
  }

  const nFormatter = (num: number | string, digits: number) => {
    num = Number(num)
    if (num < 1000) {
      return num.toString()
    }
    const lookup = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'B' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' }
    ]
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    const item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value
      })
    return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
  }

  const isValidBTCAddress = (address: string) => {
    return validate(address)
  }

  const isValidPrincipal = (principal: string) => {
    try {
      Principal.fromText(principal)
      return true
    } catch (error) {
      return false
    }
  }

  const timeAgo = (time: number, absolute: boolean) => {
    if (absolute) {
      const date = DateTime.fromMillis(time)
      return date.toFormat('dd MMM yy, hh:mm:ss ZZZ')
    } else {
      const timeDifference = DateTime.now().diff(DateTime.fromMillis(time))
      const duration = Duration.fromMillis(timeDifference.as('milliseconds'))

      const days = Math.floor(duration.as('days'))
      const hours = Math.floor(duration.as('hours')) % 24
      const minutes = Math.floor(duration.as('minutes')) % 60

      let result = ''
      if (days > 0) {
        result += `${days}d `
      }
      if (hours > 0) {
        result += `${hours}h `
      }
      if (minutes > 0) {
        result += `${minutes}m `
      }

      return result.trim() ? result.trim() + ' ago' : 'Just now'
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = DateTime.fromMillis(timestamp)
    return date.toFormat('dd MMM yy, hh:mm:ss ZZZ')
  }

  const formatTimestampAsMDYhms = (timestamp: number) => {
    return DateTime.fromMillis(timestamp).toFormat('MMM dd yyyy, hh:mm:ss')
  }

  const convertSats2Btc = (amount: number) => {
    return amount / SATOSHIS_PER_BTC
  }

  const convertSatsToUsd = (sats: number, btcPirce: number) => {
    return (sats / SATOSHIS_PER_BTC) * btcPirce
  }

  const convertUsd2Sats = (usd: number, btcPirce: number) => {
    return (usd / btcPirce) * SATOSHIS_PER_BTC
  }

  return {
    toggleBodyScroll,
    fetchBTCdata,
    nFormatter,
    isValidBTCAddress,
    isValidPrincipal,
    timeAgo,
    formatTimestamp,
    formatTimestampAsMDYhms,
    convertSats2Btc,
    convertSatsToUsd,
    convertUsd2Sats
  }
}
