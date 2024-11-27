import type {
  MarketOptionOutput,
  ActivityType,
  MarketResult as RawMarketResult,
  BetterOutput,
  CommentOutput as RawComment,
  Category as RawCategory,
  MarketOutput,
  TopMarketOutput,
  TopMarket as RawTopMarket,
  MarketVersion as RawMarketVersion
} from '@/backend/betbtc-backend.did'
import type { User } from './profileDataTypes'
import type { Principal } from '@dfinity/principal'

export type PickedUser = Pick<User, 'id' | 'handle' | 'displayName' | 'avatar'>

export type Market = {
  id: string
  categories: string[]
  result?: MarketResult
  title: string
  expireAt: Date
  createdAt: Date
  resolvedAt?: Date
  closedAt?: Date
  createdBy: string
  resolveLink?: string
  marked: string[]
  image: string
  description: string
  options: MarketOption[]
  version: MarketVersion
}

export enum MarketVersion {
  V1,
  V2
}

export const asMarketVersion = (rawMarketVersion: RawMarketVersion): MarketVersion => {
  switch (Object.keys(rawMarketVersion)[0]) {
    case 'V1':
      return MarketVersion.V1
    case 'V2':
      return MarketVersion.V2
    default:
      return MarketVersion.V1
  }
}

export const asRawMarketVersion = (marketVersion: MarketVersion): RawMarketVersion => {
  switch (marketVersion) {
    case MarketVersion.V1:
      return { V1: null }
    case MarketVersion.V2:
      return { V2: null }
    default:
      return { V1: null }
  }
}

export const asMarket = (market: MarketOutput): Market => {
  const { ca, cb, ea, r, rl, m, o, c, t, i, d, ra, cla, v, ...rest } = market
  return {
    ...rest,
    version: asMarketVersion(v),
    categories: c.map((c) => c.toLowerCase()),
    title: t,
    image: i,
    description: d,
    createdAt: new Date(Number(ca)),
    expireAt: new Date(Number(ea)),
    resolvedAt: ra.length > 0 ? new Date(Number(ra[0])) : undefined,
    closedAt: cla.length > 0 ? new Date(Number(cla[0])) : undefined,
    createdBy: cb.toText(),
    resolveLink: rl.length ? rl[0] : undefined,
    marked: m.map((ma) => ma.toText()),
    result: r.length ? asMarketResult(r[0]) : undefined,
    options: o.map((option) => asMarketOption(option))
  }
}

export type TopMarket = {
  id: string
  title: string
  expireAt: Date
  categories: string[]
  totalVolume: number
  todayVolume: number
  totalTxn: number
  todayTxn: number
}

export type TopMarketData = {
  todayVolume: number
  todayTxn: number
  topMarkets: TopMarket[]
}

export const asTopMarketData = (topMarketData: TopMarketOutput): TopMarketData => {
  const { tv, tt, tms, ...rest } = topMarketData
  return {
    ...rest,
    todayVolume: Number(tv),
    todayTxn: tt,
    topMarkets: tms.map((tm) => asTopMarket(tm))
  }
}

const asTopMarket = (topMarket: RawTopMarket): TopMarket => {
  const { id, t, c, ttv, ttt, tdt, tdv, ea, ...rest } = topMarket
  return {
    ...rest,
    id,
    title: t,
    expireAt: new Date(Number(ea)),
    categories: c,
    totalTxn: ttt,
    totalVolume: Number(ttv),
    todayVolume: Number(tdv),
    todayTxn: tdt
  }
}

export const asMarkets = (markets: MarketOutput[]): Market[] =>
  markets.map((market) => asMarket(market))

export type MarketOption = {
  option: string
  noBetAmount: number
  yesTokenAmount: number
  betters: Better[]
  noTokenAmount: number
  yesBetAmount: number
}

export const asMarketOption = (rawOption: MarketOptionOutput): MarketOption => {
  const { nba, yta, nta, yba, b, o, ...rest } = rawOption

  return {
    ...rest,
    noBetAmount: Number(nba),
    yesTokenAmount: Number(yta),
    noTokenAmount: Number(nta),
    yesBetAmount: Number(yba),
    option: o,
    betters: b.map((better) => asBetter(better))
  }
}

export type MarketResult = {
  optionId: number
  betType: ActivityType
}

export const asMarketResult = (rawResult: RawMarketResult): MarketResult => {
  const { bt, oi, ...rest } = rawResult

  return {
    ...rest,
    optionId: oi,
    betType: bt
  }
}

export type Better = {
  user: PickedUser
  betAmount: number
  returnAmount?: number
  tokenAmount: number
  tokenPrice: number
  timestamp: Date
  betType: ActivityType
}

export const asBetter = (rawBetter: BetterOutput): Better => {
  const { ba, ra, ta, tp, ui, ts, bt, uh, udn, ua } = rawBetter

  return {
    betAmount: Number(ba),
    returnAmount: ra.length ? Number(ra[0]) : undefined,
    tokenAmount: Number(ta),
    tokenPrice: Number(tp),
    user: {
      id: ui.toText(),
      handle: uh,
      displayName: udn.length ? udn[0] : undefined,
      avatar: ua
    },
    timestamp: new Date(Number(ts)),
    betType: bt
  }
}

export type HolderType = {
  user: PickedUser
  option: string
  type: string
  volume: number
}

export type Comment = {
  user: PickedUser
  id: string
  content: string
  marketId: string
  like: string[]
  parentCommentId?: string
  createdAt: Date
  thumbUp: string[]
  replies: string[]
  thumbDown: string[]
}

export const asComment = (rawComment: RawComment): Comment => {
  const { mi, pci, ca, ui, tu, td, l, ua, uh, udn, r, ...rest } = rawComment

  return {
    ...rest,
    marketId: mi,
    parentCommentId: pci.length ? pci[0] : undefined,
    createdAt: new Date(Number(ca)),
    user: {
      id: ui.toText(),
      handle: uh,
      displayName: udn.length ? udn[0] : undefined,
      avatar: ua
    },
    thumbUp: tu.map((t) => t.toText()),
    thumbDown: td.map((t) => t.toText()),
    like: l.map((t) => t.toText()),
    replies: r
  }
}

export const asComments = (rawComments: RawComment[]): Comment[] => {
  return rawComments.map((comment) => asComment(comment))
}

export type Category = {
  id: string
  label: string
  icon?: string
  color?: string
  createdBy: Principal
  createdAt: Date
  updatedAt: Date
  parentCategoryId?: string
}

export const asCategory = (rawCategory: RawCategory): Category => {
  const { pci, id, ic, lb, ca, cb, cl, ua } = rawCategory

  return {
    id,
    icon: ic.length ? ic[0] : undefined,
    parentCategoryId: pci.length ? pci[0] : undefined,
    label: lb,
    createdAt: new Date(Number(ca)),
    updatedAt: new Date(Number(ua)),
    createdBy: cb,
    color: cl.length ? cl[0] : undefined
  }
}

export const asCategories = (rawCategories: RawCategory[]): Category[] => {
  return rawCategories.map((category) => asCategory(category))
}

export enum MarketStatus {
  Closed,
  Resolved,
  Resolving,
  Expired,
  Open
}
