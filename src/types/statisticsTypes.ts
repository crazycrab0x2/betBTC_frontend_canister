import { type Statistic as RawStatistic } from '@/backend/betbtc-backend.did'

export type Statistic = {
  totalVolume: bigint
  totalFee: bigint
  signUpUsers: number
  totalReferrals: number
  totalPayoutsIssued: bigint
  totalMarket: number
  resolvedMarket: number
  waitingPayout: bigint
  totalTransaction: number
}

export const asStatistics = (val: RawStatistic): Statistic => {
  const { tv, tf, suu, tr, tpi, tm, rm, wp, tt } = val
  return {
    totalVolume: tv,
    totalFee: tf,
    signUpUsers: suu,
    totalReferrals: tr,
    totalPayoutsIssued: tpi,
    totalMarket: tm,
    resolvedMarket: rm,
    waitingPayout: wp,
    totalTransaction: Number(tt)
  }
}
