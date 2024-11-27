import type { PickedUser } from './marketDataTypes'
import type {
  PointLogOutput,
  TransactionOutput,
  NotificationOutput,
  PayoutOutput,
  ActivityType,
  FundLog as ReturnedFundLog
} from '@/backend/betbtc-backend.did'
import { asMarketVersion, MarketVersion } from './marketDataTypes'

export interface Notification {
  user: PickedUser
  id: string
  types: object
  replyComment: string
  replyId: string
  content?: string
  viewed: boolean
  timestamp: Date
}

export interface FundLog {
  id: string
  types: object
  userId: string
  date: number
  address?: string
  amount: number
}

export const asNotification = (rawNotification: NotificationOutput): Notification => {
  const { id, t, ui, c, v, fua, fudn, fuh, rcc, rci, ts } = rawNotification

  return {
    id,
    user: {
      id: ui.toText(),
      avatar: fua,
      handle: fuh,
      displayName: fudn.length ? fudn[0] : undefined
    },
    types: t,
    replyComment: rcc,
    replyId: rci,
    content: c.length ? c[0] : undefined,
    viewed: v,
    timestamp: new Date(Number(ts))
  }
}

export const asFund = (rawFund: ReturnedFundLog): FundLog => {
  const { a, t, ad, id, ts, ui } = rawFund

  return {
    amount: Number(a),
    address: ad.length ? ad[0] : undefined,
    date: Number(ts),
    userId: ui.toString(),
    types: t,
    id: id
  }
}

export type NotificationType = 'reply' | 'like' | 'notify'

export type ReplyType = 'reply' | 'bet' | 'check'

export interface Transaction {
  user: PickedUser
  id: string
  timestamp: bigint
  marketId: string
  version: MarketVersion
  marketTitle: string
  marketImage: string
  optionId: number
  optionTitle: string
  types: ActivityType
  tokenAmount: number
  tokenPrice: number
  totalAmount: number
  resolveDate?: Date
  resolveType?: ActivityType
  resolveOptionId?: number
  returnVolume?: number
}

export const asTransaction = (transaction: TransactionOutput): Transaction => {
  const { id, mi, mt, mim, oi, ot, ta, rd, rt, roi, rv, t, ts, ui, uh, udn, ua, tka, tkp, v } =
    transaction

  return {
    id,
    types: t,
    timestamp: ts,
    user: {
      id: ui.toText(),
      handle: uh,
      displayName: udn.length > 0 ? udn[0] : undefined,
      avatar: ua
    },
    marketId: mi,
    version: asMarketVersion(v),
    marketTitle: mt,
    marketImage: mim,
    optionId: oi,
    optionTitle: ot,
    tokenAmount: Number(tka),
    tokenPrice: Number(tkp),
    totalAmount: Number(ta),
    resolveDate: rd.length ? new Date(Number(rd[0])) : undefined,
    resolveType: rt.length ? rt[0] : undefined,
    resolveOptionId: roi.length ? roi[0] : undefined,
    returnVolume: rv.length ? Number(rv[0]) : undefined
  }
}

export interface Payout {
  returnedVolume: number
  tnxs: Transaction[]
  numResolved: number
  numMarket: number
  returnVolume: number
  investVolume: number
  numBet: number
  numResolve: number
  maxNum: number
}

export const asPayout = (payout: PayoutOutput): Payout => {
  const { rv, t, nr, nm, nv, iv, nb, mn, rvd } = payout

  return {
    returnVolume: Number(rv),
    tnxs: t.map((t) => asTransaction(t)),
    numResolved: nv,
    numMarket: nm,
    returnedVolume: Number(rvd),
    investVolume: Number(iv),
    numBet: nb,
    numResolve: nr,
    maxNum: mn
  }
}

export interface Reward {
  id: string
  user: PickedUser
  timestamp: bigint
  content: string
  referredUserId?: string
  point: number
  amount?: number
}

export const asReward = (rawReward: PointLogOutput): Reward => {
  const { id, ui, ts, c, r, p, a, ua, udn, un } = rawReward

  return {
    id,
    user: {
      id: ui.toText(),
      handle: un,
      displayName: udn.length > 0 ? udn[0] : undefined,
      avatar: ua
    },
    timestamp: ts,
    content: c,
    referredUserId: r.length > 0 ? r[0]?.toText() : undefined,
    point: Number(p),
    amount: a.length > 0 ? Number(a[0]) : undefined
  }
}
