import { type MarketOption, type Market, MarketVersion } from '@/types/marketDataTypes'
import { useHelpers } from '@/composables/useHelpers'
import { MARKET_FEE } from '@/config/market'

export const getMultipleOutcomes = (options: MarketOption[]): number[] => {
  const result: number[] = []

  if (options.length === 1) {
    const singleOption = options[0]
    const outcome = bondingCurve(singleOption.yesTokenAmount, singleOption.noTokenAmount) / 200
    result.push(outcome)
  } else {
    const liquidityParameter = 100

    let fraction = 0

    for (const option of options) {
      const optionAmount = option.yesTokenAmount
      fraction += Math.exp(optionAmount / liquidityParameter)
    }

    for (const option of options) {
      const optionAmount = option.yesTokenAmount

      const outcome = Math.exp(optionAmount / liquidityParameter) / fraction

      result.push(outcome)
    }
  }

  return result
}

export const bondingCurve = (yes: number, no: number): number => {
  return 200.0 / (1.0 + Math.exp(-0.0001 * (yes - no)))
}

export const getChanceForV2 = (
  totalAmount: number,
  yesAmount: number,
  totalOptions: number
): number => {
  if (totalAmount > 0) {
    return yesAmount / totalAmount
  } else {
    return 1 / totalOptions
  }
}

export const getChance = (market: Market, optionId: number): number => {
  switch (market.version) {
    case MarketVersion.V1:
      return getMultipleOutcomes(market.options)[optionId]
    case MarketVersion.V2:
      // eslint-disable-next-line no-case-declarations
      const totalBetAmount = market.options.reduce((a, b) => a + b.yesBetAmount + b.noBetAmount, 0)
      return getChanceForV2(
        totalBetAmount,
        market.options[optionId].yesBetAmount,
        market.options.length
      )
    default:
      throw new Error(`Version isn't supported: ${market.version}`)
  }
}

const { convertUsd2Sats, formatTimestampAsMDYhms } = useHelpers()

export const getPotentialReturn = (
  option: MarketOption,
  version: MarketVersion,
  totalBetAmount: number,
  betAmount: number,
  tokenAmount: number,
  type: 'Yes' | 'No',
  btcPrice: number,
  isBtc: boolean
): number => {
  const { yesBetAmount, yesTokenAmount, noBetAmount, noTokenAmount } = option
  const betAmountInSats = isBtc ? betAmount : convertUsd2Sats(betAmount, btcPrice)
  switch (version) {
    case MarketVersion.V1: {
      if (type == 'Yes') {
        return (
          betAmountInSats +
          (noBetAmount * tokenAmount * (100 - MARKET_FEE)) / 100 / (yesTokenAmount + tokenAmount)
        )
      } else {
        return (
          betAmountInSats +
          (yesBetAmount * tokenAmount * (100 - MARKET_FEE)) / 100 / (noTokenAmount + tokenAmount)
        )
      }
    }
    case MarketVersion.V2: {
      return (
        betAmountInSats +
        ((totalBetAmount - yesBetAmount) * tokenAmount * (100 - MARKET_FEE)) /
          100 /
          (yesTokenAmount + tokenAmount)
      )
    }
    default:
      throw new Error(`Version is not supported: ${version}`)
  }
}

export const generateMarketGraphData = (market: Market, optionId: number) => {
  const { betters } = market.options[optionId]
  let tmpYesPrice = 500
  let tmpNoPrice = 500
  const graphYSeries: number[] = []
  const graphXSeries: string[] = []
  Array.from(
    new Set(
      betters
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map((item) => {
          graphXSeries.push(formatTimestampAsMDYhms(new Date(item.timestamp).getTime()))
          return new Date(item.timestamp).getTime()
        })
        .map((a) => betters.filter((b) => new Date(b.timestamp).getTime() == a))
        .map((a) => {
          let value = 1000
          if (market.version === MarketVersion.V1) {
            a.forEach((b) => {
              if ('Yes' in b.betType) tmpYesPrice += b.tokenAmount
              else tmpNoPrice += b.tokenAmount
            })
            value = Number(
              (bondingCurve(tmpYesPrice, tmpNoPrice) * Math.pow(10, DECIMAL)).toFixed(2)
            )
          } else {
            const tmpTotalAmount = market.options
              .map((c) => c.betters.filter((d) => new Date(d.timestamp) < new Date(a[0].timestamp)))
              .map((d) => d.reduce((e, f) => e + f.betAmount, 0))
              .reduce((g, f) => g + f, 0)
            const yesBetAmount = market.options[0].betters
              .filter((c) => new Date(c.timestamp).getTime() < new Date(a[0].timestamp).getTime())
              .reduce((d, e) => d + e.betAmount, 0)
            value = Number(
              (getChanceForV2(tmpTotalAmount, yesBetAmount, market.options.length) * 100).toFixed(2)
            )
          }
          graphYSeries.push(value)
        })
    )
  )
  return { graphYSeries, graphXSeries }
}

export const DECIMAL = 1
