import { encodeIcrcAccount, type IcrcAccount } from '@dfinity/ledger-icrc'

export const getBtcLink = (account: IcrcAccount) => {
  return `https://dashboard.internetcomputer.org/bitcoin/account/${encodeIcrcAccount(account)}`
}
