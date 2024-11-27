import type {
  User as RawUser,
  Referral as RawReferral,
  LeaderBoardOutput as RawLeaderBoardOutput
} from '@/backend/betbtc-backend.did'
import type { PickedUser } from './marketDataTypes'

export type User = {
  id: string
  handle: string
  displayName?: string
  avatar: string
  bio?: string
  principals: string[]
  referrals: Referral[]
  referredBy?: string
}

export const asUser = (user: RawUser): User => {
  return {
    avatar: user.a,
    bio: user.b.length ? user.b[0] : undefined,
    displayName: user.dn.length ? user.dn[0] : undefined,
    id: user.id.toText(),
    handle: user.n,
    principals: user.p.map((p) => p.toText()),
    referrals: asReferrals(user.r),
    referredBy: user.rb.length ? user.rb[0].toText() : undefined
  }
}

export type Referral = {
  timestamp: Date
  referralCode: string
}

export const asReferral = (referral: RawReferral): Referral => {
  return {
    timestamp: new Date(Number(referral.ts)),
    referralCode: referral.rc
  }
}

export const asReferrals = (referrals: RawReferral[]): Referral[] => {
  return referrals.map((referral) => asReferral(referral))
}

export type LeaderBoardOutput = {
  rank: number
  user: PickedUser
  point: number
  volume: number
  profit: number
}

export const asLeaderBoardOutput = (leaderboard: RawLeaderBoardOutput): LeaderBoardOutput => {
  return {
    rank: leaderboard.r,
    point: Number(leaderboard.p),
    volume: Number(leaderboard.v),
    profit: Number(leaderboard.pr),
    user: {
      avatar: leaderboard.ua,
      handle: leaderboard.uh,
      id: leaderboard.ui.toString(), ////have error on backend, please check that.
      displayName: leaderboard.udn.length ? leaderboard.udn[0] : undefined
    }
  }
}

export const asLeaderBoardOutputs = (leaderboards: RawLeaderBoardOutput[]): LeaderBoardOutput[] => {
  return leaderboards.map((leaderboard) => asLeaderBoardOutput(leaderboard))
}
