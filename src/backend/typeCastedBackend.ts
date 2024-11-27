import { Actor } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { sha256 } from 'js-sha256'

import { asLeaderBoardOutputs, asUser } from '@/types/profileDataTypes'
import { betbtc_backend, canisterId as backendCanisterId } from './index'
import { asCategories, asCategory, asComment, asMarket, asMarkets, asTopMarketData } from '@/types/marketDataTypes'
import { asFund, asNotification, asReward, asTransaction } from '@/types/notificationTypes'
import { asPayout } from '@/types/notificationTypes'
import { ckBtcLedger } from './ckbtc-ledger'
import { type Account } from './ckbtc-ledger/ckbtc.did'
import { asStatistics } from '@/types/statisticsTypes'

type BackendGetMarketsArgs = Parameters<typeof betbtc_backend.get_markets>
type BackendGetMarketByIdArgs = Parameters<typeof betbtc_backend.get_market_by_id>
type BackendAddCommentArgs = Parameters<typeof betbtc_backend.add_comment>
type BackendGetCommentsArgs = Parameters<typeof betbtc_backend.get_comments>
type BackendSignupArgs = Parameters<typeof betbtc_backend.signup>
type BackendSigninArgs = Parameters<typeof betbtc_backend.signin>
type BackendUpdateUserArgs = Parameters<typeof betbtc_backend.update_user>
type BackendGetWatchlistArgs = Parameters<typeof betbtc_backend.get_watchlist>
type BackendGetTransactionActivityArgs = Parameters<typeof betbtc_backend.get_transaction_activity>
type BackendGetRewardActivityArgs = Parameters<typeof betbtc_backend.get_reward_activity>
type BackendGetPayoutActivityArgs = Parameters<typeof betbtc_backend.get_payout_activity>
type BackendGetNotificationsArgs = Parameters<typeof betbtc_backend.get_notifications>
type BackendGetFundActivityLogsArgs = Parameters<typeof betbtc_backend.get_fund_activity_logs>
type BackendGetNewNotificationsArgs = Parameters<typeof betbtc_backend.get_new_notifications>
type BackendGetLeaderBoardArgs = Parameters<typeof betbtc_backend.get_leaderboard>
type BackendGetTopMarketsArgs = Parameters<typeof betbtc_backend.get_top_markets>
type BackendGetUsersArgs = Parameters<typeof betbtc_backend.get_users>
type BackendGetStatisticsArgs = Parameters<typeof betbtc_backend.get_statistics>
type BackendGetCategoriesArgs = Parameters<typeof betbtc_backend.get_categories>

export const typeCastedBackendActor = {
  ...betbtc_backend,
  get_markets: async (...args: BackendGetMarketsArgs) => {
    const result = await betbtc_backend.get_markets(...args)
    return {
      markets: asMarkets(result[0]),
      total: result[1]
    }
  },
  get_market_by_id: async (...args: BackendGetMarketByIdArgs) => {
    const result = await betbtc_backend.get_market_by_id(...args)
    if (result.length) {
      return asMarket(result[0])
    }
    return undefined
  },
  add_comment: async (...args: BackendAddCommentArgs) => {
    const result = await betbtc_backend.add_comment(...args)
    if ('Ok' in result) {
      return {
        success: true,
        comment: asComment(result.Ok)
      }
    }
    return {
      success: false
    }
  },
  get_comments: async (...args: BackendGetCommentsArgs) => {
    const result = await betbtc_backend.get_comments(...args)
    return result.map(asComment)
  },
  get_replies: async (...args: BackendGetCommentsArgs) => {
    const result = await betbtc_backend.get_replies(...args)
    return result.map(asComment)
  },
  signin: async (...args: BackendSigninArgs) => {
    const result = await betbtc_backend.signin(...args)
    if ('Ok' in result) {
      return {
        Ok: asUser(result.Ok)
      }
    }
    return {
      Err: result.Err
    }
  },
  signup: async (...args: BackendSignupArgs) => {
    const result = await betbtc_backend.signup(...args)
    if ('Ok' in result) {
      return {
        Ok: asUser(result.Ok)
      }
    }
    return {
      Err: result.Err
    }
  },
  get_users: async (...args: BackendGetUsersArgs) => {
    const result = await betbtc_backend.get_users(...args)
    return [result[0].map(asUser), result[1]] as const
  },
  update_user: async (...args: BackendUpdateUserArgs) => {
    const result = await betbtc_backend.update_user(...args)
    if ('Ok' in result) {
      return {
        Ok: asUser(result.Ok)
      }
    }
    return {
      Err: result.Err
    }
  },
  get_watchlist: async (...args: BackendGetWatchlistArgs) => {
    const result = await betbtc_backend.get_watchlist(...args)
    return asMarkets(result)
  },
  get_payout_activity: async (...args: BackendGetPayoutActivityArgs) => {
    const result = await betbtc_backend.get_payout_activity(...args)
    return asPayout(result)
  },
  get_transaction_activity: async (...args: BackendGetTransactionActivityArgs) => {
    const result = await betbtc_backend.get_transaction_activity(...args)
    return result.map(asTransaction)
  },
  get_reward_activity: async (...args: BackendGetRewardActivityArgs) => {
    const result = await betbtc_backend.get_reward_activity(...args)
    return result.map(asReward)
  },
  get_notifications: async (...args: BackendGetNotificationsArgs) => {
    const result = await betbtc_backend.get_notifications(...args)
    return result.map(asNotification)
  },
  get_fund_activity_logs: async (...args: BackendGetFundActivityLogsArgs) => {
    const result = await betbtc_backend.get_fund_activity_logs(...args)
    return result.map(asFund)
  },
  get_new_notifications: async (...args: BackendGetNewNotificationsArgs) => {
    const result = await betbtc_backend.get_new_notifications(...args)
    return result.map(asNotification)
  },
  get_balance: (userId: string) => {
    const subaccount = Principal.fromText(userId)

    const hash = sha256.create()
    hash.update(subaccount.toUint8Array())

    const account: Account = {
      owner: Principal.fromText(backendCanisterId),
      subaccount: [hash.array()]
    }

    return ckBtcLedger.icrc1_balance_of(account)
  },
  get_leaderboard: async (...args: BackendGetLeaderBoardArgs) => {
    const result = await betbtc_backend.get_leaderboard(...args)
    return {
      users: asLeaderBoardOutputs(result[0]),
      count: result[1]
    }
  },
  get_top_markets: async (...args: BackendGetTopMarketsArgs) => {
    const result = await betbtc_backend.get_top_markets(...args)
    return asTopMarketData(result)
  },
  get_statistics: async (...args: BackendGetStatisticsArgs) => {
    const result = await betbtc_backend.get_statistics(...args)
    if ('Ok' in result) {
      return {
        Ok: asStatistics(result.Ok)
      }
    }
    return {
      Err: result.Err
    }
  },
  get_categories: async (...args: BackendGetCategoriesArgs) => {
    const result = await betbtc_backend.get_categories(...args)
    return asCategories(result)
  },
}
