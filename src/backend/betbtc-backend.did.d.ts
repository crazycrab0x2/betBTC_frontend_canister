import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ActivitySortType = { 'Amount' : null } |
  { 'Time' : null } |
  { 'Earning' : null };
export type ActivityType = { 'No' : null } |
  { 'SNo' : null } |
  { 'Win' : null } |
  { 'Yes' : null } |
  { 'Withdraw' : null } |
  { 'Loss' : null } |
  { 'Deposit' : null } |
  { 'SYes' : null } |
  { 'Send' : null } |
  { 'Register' : null } |
  { 'Unkonwn' : null } |
  { 'Create' : null } |
  { 'Invite' : null } |
  { 'Receive' : null };
export interface BetterOutput {
  'ba' : bigint,
  'bt' : ActivityType,
  'ra' : [] | [bigint],
  'ta' : bigint,
  'tp' : bigint,
  'ts' : bigint,
  'ua' : string,
  'uh' : string,
  'ui' : Principal,
  'udn' : [] | [string],
}
export interface Category {
  'ca' : bigint,
  'cb' : Principal,
  'cl' : [] | [string],
  'ic' : [] | [string],
  'id' : string,
  'lb' : string,
  'ua' : bigint,
  'pci' : [] | [string],
}
export interface CommentOutput {
  'l' : Array<Principal>,
  'r' : Array<string>,
  'ca' : bigint,
  'id' : string,
  'mi' : string,
  'td' : Array<Principal>,
  'tu' : Array<Principal>,
  'ua' : string,
  'uh' : string,
  'ui' : Principal,
  'pci' : [] | [string],
  'udn' : [] | [string],
  'content' : string,
}
export interface FundLog {
  'a' : bigint,
  't' : ActivityType,
  'ad' : [] | [string],
  'id' : string,
  'ts' : bigint,
  'ui' : Principal,
  'cti' : [] | [bigint],
}
export interface HttpHeader { 'value' : string, 'name' : string }
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<[string, string]>,
}
export interface HttpResponse {
  'body' : Uint8Array | number[],
  'headers' : Array<[string, string]>,
  'status_code' : number,
}
export interface HttpResponse_1 {
  'status' : bigint,
  'body' : Uint8Array | number[],
  'headers' : Array<HttpHeader>,
}
export interface InitArg {
  'minter' : Principal,
  'collector' : Principal,
  'ledger' : Principal,
}
export interface LeaderBoardOutput {
  'p' : bigint,
  'r' : number,
  'v' : bigint,
  'pr' : bigint,
  'ua' : string,
  'uh' : string,
  'ui' : Principal,
  'udn' : [] | [string],
}
export interface MarketOptionOutput {
  'b' : Array<BetterOutput>,
  'o' : string,
  'nba' : bigint,
  'nta' : bigint,
  'yba' : bigint,
  'yta' : bigint,
}
export interface MarketOutput {
  'c' : Array<string>,
  'd' : string,
  'i' : string,
  'm' : Array<Principal>,
  'o' : Array<MarketOptionOutput>,
  'r' : [] | [MarketResult],
  't' : string,
  'v' : MarketVersion,
  'ca' : bigint,
  'cb' : Principal,
  'ea' : bigint,
  'id' : string,
  'ra' : [] | [bigint],
  'rl' : [] | [string],
  'cla' : [] | [bigint],
}
export interface MarketPrice { 'mi' : string, 'mo' : Array<OptionPrice> }
export interface MarketResult { 'bt' : ActivityType, 'oi' : number }
export type MarketVersion = { 'V1' : null } |
  { 'V2' : null };
export interface NotificationOutput {
  'c' : [] | [string],
  't' : NotificationType,
  'v' : boolean,
  'id' : string,
  'ts' : bigint,
  'ui' : Principal,
  'fua' : string,
  'fuh' : string,
  'fui' : Principal,
  'rcc' : string,
  'rci' : string,
  'fudn' : [] | [string],
}
export type NotificationType = { 'UnThumbDown' : null } |
  { 'Like' : null } |
  { 'Reply' : null } |
  { 'UnThumbUp' : null } |
  { 'Unlike' : null } |
  { 'ThumbDown' : null } |
  { 'ThumbUp' : null };
export interface OptionPrice { 'np' : bigint, 'yp' : bigint }
export interface PayoutOutput {
  't' : Array<TransactionOutput>,
  'iv' : bigint,
  'mn' : number,
  'nb' : number,
  'nm' : number,
  'nr' : number,
  'nv' : number,
  'rv' : bigint,
  'rvd' : bigint,
}
export interface PointLogOutput {
  'a' : [] | [bigint],
  'c' : string,
  'p' : bigint,
  'r' : [] | [Principal],
  'id' : string,
  'ts' : bigint,
  'ua' : string,
  'ui' : Principal,
  'un' : string,
  'udn' : [] | [string],
}
export interface Referral { 'rc' : string, 'ts' : bigint }
export type Result = { 'Ok' : null } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : Category } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : CommentOutput } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : MarketOutput } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : Statistic } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : User } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : bigint } |
  { 'Err' : UpdateBalanceErrorOutput };
export interface Statistic {
  'rm' : number,
  'tf' : bigint,
  'tm' : number,
  'tr' : number,
  'tt' : bigint,
  'tv' : bigint,
  'wp' : bigint,
  'suu' : number,
  'tpi' : bigint,
}
export interface TopMarket {
  'c' : Array<string>,
  't' : string,
  'ea' : bigint,
  'id' : string,
  'tdt' : number,
  'tdv' : bigint,
  'ttt' : number,
  'ttv' : bigint,
}
export interface TopMarketOutput {
  'tt' : number,
  'tv' : bigint,
  'tms' : Array<TopMarket>,
}
export type TopMarketSortType = { 'Txn' : null } |
  { 'Vol' : null };
export interface TransactionOutput {
  't' : ActivityType,
  'v' : MarketVersion,
  'id' : string,
  'mi' : string,
  'mt' : string,
  'oi' : number,
  'ot' : string,
  'rd' : [] | [bigint],
  'rt' : [] | [ActivityType],
  'rv' : [] | [bigint],
  'ta' : bigint,
  'ts' : bigint,
  'ua' : string,
  'uh' : string,
  'ui' : Principal,
  'cti' : [] | [bigint],
  'mim' : string,
  'roi' : [] | [number],
  'tka' : bigint,
  'tkp' : bigint,
  'udn' : [] | [string],
}
export interface TransformArgs {
  'context' : Uint8Array | number[],
  'response' : HttpResponse_1,
}
export type UpdateBalanceErrorOutput = { 'GenericError' : string } |
  { 'TemporarilyUnavailable' : string } |
  { 'AlreadyProcessing' : string } |
  { 'CanisterCallError' : string } |
  { 'NoTransaction' : string } |
  { 'Pending' : { 'confirmations' : number, 'amount' : bigint } };
export interface User {
  'a' : string,
  'b' : [] | [string],
  'n' : string,
  'p' : Array<Principal>,
  'r' : Array<Referral>,
  'ca' : bigint,
  'dn' : [] | [string],
  'id' : Principal,
  'rb' : [] | [Principal],
  'ua' : bigint,
}
export interface _SERVICE {
  'add_admin' : ActorMethod<[Principal], Result>,
  'add_category' : ActorMethod<
    [string, string, [] | [string], [] | [string], [] | [string]],
    Result_1
  >,
  'add_comment' : ActorMethod<[string, [] | [string], string], Result_2>,
  'bet' : ActorMethod<[string, number, ActivityType, bigint], Result>,
  'create_market' : ActorMethod<
    [
      string,
      string,
      string,
      string,
      [] | [bigint],
      bigint,
      Array<string>,
      string,
      Array<string>,
      boolean,
      MarketVersion,
    ],
    Result_3
  >,
  'deposit' : ActorMethod<[], Result_4>,
  'distribute' : ActorMethod<[string], Result>,
  'get_balance' : ActorMethod<[], Result_5>,
  'get_categories' : ActorMethod<[[] | [string]], Array<Category>>,
  'get_comments' : ActorMethod<[string], Array<CommentOutput>>,
  'get_fund_activity_logs' : ActorMethod<
    [Principal, Array<ActivityType>],
    Array<FundLog>
  >,
  'get_leaderboard' : ActorMethod<
    [string, number, number, string],
    [Array<LeaderBoardOutput>, number]
  >,
  'get_market_by_id' : ActorMethod<[string], [] | [MarketOutput]>,
  'get_markets' : ActorMethod<
    [[] | [string], [] | [string], number, number],
    [Array<MarketOutput>, number]
  >,
  'get_new_notifications' : ActorMethod<[Principal], Array<NotificationOutput>>,
  'get_notifications' : ActorMethod<
    [Principal, Array<NotificationType>],
    Array<NotificationOutput>
  >,
  'get_payout_activity' : ActorMethod<
    [Principal, [] | [ActivityType], ActivitySortType],
    PayoutOutput
  >,
  'get_price' : ActorMethod<[], Array<MarketPrice>>,
  'get_price_by_market_id' : ActorMethod<[string], MarketPrice>,
  'get_profile' : ActorMethod<[Principal], [] | [User]>,
  'get_replies' : ActorMethod<[string], Array<CommentOutput>>,
  'get_reward_activity' : ActorMethod<
    [Principal, Array<ActivityType>, ActivitySortType],
    Array<PointLogOutput>
  >,
  'get_statistics' : ActorMethod<[bigint, bigint], Result_6>,
  'get_top_markets' : ActorMethod<
    [TopMarketSortType, [] | [string]],
    TopMarketOutput
  >,
  'get_transaction_activity' : ActorMethod<
    [[] | [Principal], [] | [string], Array<ActivityType>, ActivitySortType],
    Array<TransactionOutput>
  >,
  'get_users' : ActorMethod<[number, number], [Array<User>, number]>,
  'get_watchlist' : ActorMethod<[Principal], Array<MarketOutput>>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'is_admin' : ActorMethod<[Principal], boolean>,
  'like_comment' : ActorMethod<[string], boolean>,
  'mark_market' : ActorMethod<[string], boolean>,
  'remove_admin' : ActorMethod<[Principal], Result>,
  'remove_category' : ActorMethod<[string], boolean>,
  'remove_market' : ActorMethod<[string], boolean>,
  'resolve_market' : ActorMethod<[string, number, string], Result>,
  'sell' : ActorMethod<[string, number, ActivityType, bigint, bigint], Result>,
  'signin' : ActorMethod<[], Result_7>,
  'signup' : ActorMethod<[string, [] | [Principal]], Result_7>,
  'thumb_down_comment' : ActorMethod<[string], boolean>,
  'thumb_up_comment' : ActorMethod<[string], boolean>,
  'transfer' : ActorMethod<[Principal, bigint], [string, string]>,
  'transform' : ActorMethod<[TransformArgs], HttpResponse_1>,
  'undo_resolve_market' : ActorMethod<[string], Result>,
  'update_balance' : ActorMethod<[], Result_8>,
  'update_category' : ActorMethod<
    [string, string, [] | [string], [] | [string], [] | [string]],
    [boolean, string]
  >,
  'update_market' : ActorMethod<
    [
      string,
      [] | [string],
      [] | [string],
      [] | [bigint],
      [] | [Array<string>],
      [] | [string],
      [] | [boolean],
    ],
    Result_3
  >,
  'update_user' : ActorMethod<
    [string, string, string, string, Array<Principal>],
    Result_7
  >,
  'upload_avatar' : ActorMethod<[string, Uint8Array | number[]], string>,
  'upload_market_image' : ActorMethod<[string, Uint8Array | number[]], string>,
  'user_handle_exists' : ActorMethod<[string], boolean>,
  'view_notification' : ActorMethod<[string], boolean>,
  'withdraw' : ActorMethod<[string, bigint], Result_4>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
