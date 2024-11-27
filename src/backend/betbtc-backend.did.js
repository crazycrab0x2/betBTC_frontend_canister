export const idlFactory = ({ IDL }) => {
  const InitArg = IDL.Record({
    'minter' : IDL.Principal,
    'collector' : IDL.Principal,
    'ledger' : IDL.Principal,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Category = IDL.Record({
    'ca' : IDL.Nat64,
    'cb' : IDL.Principal,
    'cl' : IDL.Opt(IDL.Text),
    'ic' : IDL.Opt(IDL.Text),
    'id' : IDL.Text,
    'lb' : IDL.Text,
    'ua' : IDL.Nat64,
    'pci' : IDL.Opt(IDL.Text),
  });
  const Result_1 = IDL.Variant({ 'Ok' : Category, 'Err' : IDL.Text });
  const CommentOutput = IDL.Record({
    'l' : IDL.Vec(IDL.Principal),
    'r' : IDL.Vec(IDL.Text),
    'ca' : IDL.Nat64,
    'id' : IDL.Text,
    'mi' : IDL.Text,
    'td' : IDL.Vec(IDL.Principal),
    'tu' : IDL.Vec(IDL.Principal),
    'ua' : IDL.Text,
    'uh' : IDL.Text,
    'ui' : IDL.Principal,
    'pci' : IDL.Opt(IDL.Text),
    'udn' : IDL.Opt(IDL.Text),
    'content' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'Ok' : CommentOutput, 'Err' : IDL.Text });
  const ActivityType = IDL.Variant({
    'No' : IDL.Null,
    'SNo' : IDL.Null,
    'Win' : IDL.Null,
    'Yes' : IDL.Null,
    'Withdraw' : IDL.Null,
    'Loss' : IDL.Null,
    'Deposit' : IDL.Null,
    'SYes' : IDL.Null,
    'Send' : IDL.Null,
    'Register' : IDL.Null,
    'Unkonwn' : IDL.Null,
    'Create' : IDL.Null,
    'Invite' : IDL.Null,
    'Receive' : IDL.Null,
  });
  const MarketVersion = IDL.Variant({ 'V1' : IDL.Null, 'V2' : IDL.Null });
  const BetterOutput = IDL.Record({
    'ba' : IDL.Nat,
    'bt' : ActivityType,
    'ra' : IDL.Opt(IDL.Nat),
    'ta' : IDL.Nat,
    'tp' : IDL.Nat,
    'ts' : IDL.Nat64,
    'ua' : IDL.Text,
    'uh' : IDL.Text,
    'ui' : IDL.Principal,
    'udn' : IDL.Opt(IDL.Text),
  });
  const MarketOptionOutput = IDL.Record({
    'b' : IDL.Vec(BetterOutput),
    'o' : IDL.Text,
    'nba' : IDL.Nat,
    'nta' : IDL.Nat,
    'yba' : IDL.Nat,
    'yta' : IDL.Nat,
  });
  const MarketResult = IDL.Record({ 'bt' : ActivityType, 'oi' : IDL.Nat32 });
  const MarketOutput = IDL.Record({
    'c' : IDL.Vec(IDL.Text),
    'd' : IDL.Text,
    'i' : IDL.Text,
    'm' : IDL.Vec(IDL.Principal),
    'o' : IDL.Vec(MarketOptionOutput),
    'r' : IDL.Opt(MarketResult),
    't' : IDL.Text,
    'v' : MarketVersion,
    'ca' : IDL.Nat64,
    'cb' : IDL.Principal,
    'ea' : IDL.Nat64,
    'id' : IDL.Text,
    'ra' : IDL.Opt(IDL.Nat64),
    'rl' : IDL.Opt(IDL.Text),
    'cla' : IDL.Opt(IDL.Nat64),
  });
  const Result_3 = IDL.Variant({ 'Ok' : MarketOutput, 'Err' : IDL.Text });
  const Result_4 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const Result_5 = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : IDL.Text });
  const FundLog = IDL.Record({
    'a' : IDL.Nat,
    't' : ActivityType,
    'ad' : IDL.Opt(IDL.Text),
    'id' : IDL.Text,
    'ts' : IDL.Nat64,
    'ui' : IDL.Principal,
    'cti' : IDL.Opt(IDL.Nat),
  });
  const LeaderBoardOutput = IDL.Record({
    'p' : IDL.Nat,
    'r' : IDL.Nat32,
    'v' : IDL.Nat,
    'pr' : IDL.Int,
    'ua' : IDL.Text,
    'uh' : IDL.Text,
    'ui' : IDL.Principal,
    'udn' : IDL.Opt(IDL.Text),
  });
  const NotificationType = IDL.Variant({
    'UnThumbDown' : IDL.Null,
    'Like' : IDL.Null,
    'Reply' : IDL.Null,
    'UnThumbUp' : IDL.Null,
    'Unlike' : IDL.Null,
    'ThumbDown' : IDL.Null,
    'ThumbUp' : IDL.Null,
  });
  const NotificationOutput = IDL.Record({
    'c' : IDL.Opt(IDL.Text),
    't' : NotificationType,
    'v' : IDL.Bool,
    'id' : IDL.Text,
    'ts' : IDL.Nat64,
    'ui' : IDL.Principal,
    'fua' : IDL.Text,
    'fuh' : IDL.Text,
    'fui' : IDL.Principal,
    'rcc' : IDL.Text,
    'rci' : IDL.Text,
    'fudn' : IDL.Opt(IDL.Text),
  });
  const ActivitySortType = IDL.Variant({
    'Amount' : IDL.Null,
    'Time' : IDL.Null,
    'Earning' : IDL.Null,
  });
  const TransactionOutput = IDL.Record({
    't' : ActivityType,
    'v' : MarketVersion,
    'id' : IDL.Text,
    'mi' : IDL.Text,
    'mt' : IDL.Text,
    'oi' : IDL.Nat32,
    'ot' : IDL.Text,
    'rd' : IDL.Opt(IDL.Nat64),
    'rt' : IDL.Opt(ActivityType),
    'rv' : IDL.Opt(IDL.Nat),
    'ta' : IDL.Nat,
    'ts' : IDL.Nat64,
    'ua' : IDL.Text,
    'uh' : IDL.Text,
    'ui' : IDL.Principal,
    'cti' : IDL.Opt(IDL.Nat),
    'mim' : IDL.Text,
    'roi' : IDL.Opt(IDL.Nat32),
    'tka' : IDL.Nat,
    'tkp' : IDL.Nat,
    'udn' : IDL.Opt(IDL.Text),
  });
  const PayoutOutput = IDL.Record({
    't' : IDL.Vec(TransactionOutput),
    'iv' : IDL.Nat,
    'mn' : IDL.Nat32,
    'nb' : IDL.Nat32,
    'nm' : IDL.Nat32,
    'nr' : IDL.Nat32,
    'nv' : IDL.Nat32,
    'rv' : IDL.Nat,
    'rvd' : IDL.Nat,
  });
  const OptionPrice = IDL.Record({ 'np' : IDL.Nat, 'yp' : IDL.Nat });
  const MarketPrice = IDL.Record({
    'mi' : IDL.Text,
    'mo' : IDL.Vec(OptionPrice),
  });
  const Referral = IDL.Record({ 'rc' : IDL.Text, 'ts' : IDL.Nat64 });
  const User = IDL.Record({
    'a' : IDL.Text,
    'b' : IDL.Opt(IDL.Text),
    'n' : IDL.Text,
    'p' : IDL.Vec(IDL.Principal),
    'r' : IDL.Vec(Referral),
    'ca' : IDL.Nat64,
    'dn' : IDL.Opt(IDL.Text),
    'id' : IDL.Principal,
    'rb' : IDL.Opt(IDL.Principal),
    'ua' : IDL.Nat64,
  });
  const PointLogOutput = IDL.Record({
    'a' : IDL.Opt(IDL.Nat),
    'c' : IDL.Text,
    'p' : IDL.Nat,
    'r' : IDL.Opt(IDL.Principal),
    'id' : IDL.Text,
    'ts' : IDL.Nat64,
    'ua' : IDL.Text,
    'ui' : IDL.Principal,
    'un' : IDL.Text,
    'udn' : IDL.Opt(IDL.Text),
  });
  const Statistic = IDL.Record({
    'rm' : IDL.Nat32,
    'tf' : IDL.Nat,
    'tm' : IDL.Nat32,
    'tr' : IDL.Nat32,
    'tt' : IDL.Nat,
    'tv' : IDL.Nat,
    'wp' : IDL.Nat64,
    'suu' : IDL.Nat32,
    'tpi' : IDL.Nat,
  });
  const Result_6 = IDL.Variant({ 'Ok' : Statistic, 'Err' : IDL.Text });
  const TopMarketSortType = IDL.Variant({ 'Txn' : IDL.Null, 'Vol' : IDL.Null });
  const TopMarket = IDL.Record({
    'c' : IDL.Vec(IDL.Text),
    't' : IDL.Text,
    'ea' : IDL.Nat64,
    'id' : IDL.Text,
    'tdt' : IDL.Nat32,
    'tdv' : IDL.Nat,
    'ttt' : IDL.Nat32,
    'ttv' : IDL.Nat,
  });
  const TopMarketOutput = IDL.Record({
    'tt' : IDL.Nat32,
    'tv' : IDL.Nat,
    'tms' : IDL.Vec(TopMarket),
  });
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'status_code' : IDL.Nat16,
  });
  const Result_7 = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
  const HttpHeader = IDL.Record({ 'value' : IDL.Text, 'name' : IDL.Text });
  const HttpResponse_1 = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HttpHeader),
  });
  const TransformArgs = IDL.Record({
    'context' : IDL.Vec(IDL.Nat8),
    'response' : HttpResponse_1,
  });
  const UpdateBalanceErrorOutput = IDL.Variant({
    'GenericError' : IDL.Text,
    'TemporarilyUnavailable' : IDL.Text,
    'AlreadyProcessing' : IDL.Text,
    'CanisterCallError' : IDL.Text,
    'NoTransaction' : IDL.Text,
    'Pending' : IDL.Record({
      'confirmations' : IDL.Nat32,
      'amount' : IDL.Nat64,
    }),
  });
  const Result_8 = IDL.Variant({
    'Ok' : IDL.Nat64,
    'Err' : UpdateBalanceErrorOutput,
  });
  return IDL.Service({
    'add_admin' : IDL.Func([IDL.Principal], [Result], []),
    'add_category' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [Result_1],
        [],
      ),
    'add_comment' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Text],
        [Result_2],
        [],
      ),
    'bet' : IDL.Func(
        [IDL.Text, IDL.Nat32, ActivityType, IDL.Nat],
        [Result],
        [],
      ),
    'create_market' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Nat64),
          IDL.Nat64,
          IDL.Vec(IDL.Text),
          IDL.Text,
          IDL.Vec(IDL.Text),
          IDL.Bool,
          MarketVersion,
        ],
        [Result_3],
        [],
      ),
    'deposit' : IDL.Func([], [Result_4], []),
    'distribute' : IDL.Func([IDL.Text], [Result], []),
    'get_balance' : IDL.Func([], [Result_5], []),
    'get_categories' : IDL.Func(
        [IDL.Opt(IDL.Text)],
        [IDL.Vec(Category)],
        ['query'],
      ),
    'get_comments' : IDL.Func([IDL.Text], [IDL.Vec(CommentOutput)], ['query']),
    'get_fund_activity_logs' : IDL.Func(
        [IDL.Principal, IDL.Vec(ActivityType)],
        [IDL.Vec(FundLog)],
        ['query'],
      ),
    'get_leaderboard' : IDL.Func(
        [IDL.Text, IDL.Nat32, IDL.Nat32, IDL.Text],
        [IDL.Vec(LeaderBoardOutput), IDL.Nat32],
        ['query'],
      ),
    'get_market_by_id' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(MarketOutput)],
        ['query'],
      ),
    'get_markets' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Nat8, IDL.Nat32],
        [IDL.Vec(MarketOutput), IDL.Nat32],
        ['query'],
      ),
    'get_new_notifications' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(NotificationOutput)],
        ['query'],
      ),
    'get_notifications' : IDL.Func(
        [IDL.Principal, IDL.Vec(NotificationType)],
        [IDL.Vec(NotificationOutput)],
        ['query'],
      ),
    'get_payout_activity' : IDL.Func(
        [IDL.Principal, IDL.Opt(ActivityType), ActivitySortType],
        [PayoutOutput],
        ['query'],
      ),
    'get_price' : IDL.Func([], [IDL.Vec(MarketPrice)], ['query']),
    'get_price_by_market_id' : IDL.Func([IDL.Text], [MarketPrice], ['query']),
    'get_profile' : IDL.Func([IDL.Principal], [IDL.Opt(User)], ['query']),
    'get_replies' : IDL.Func([IDL.Text], [IDL.Vec(CommentOutput)], ['query']),
    'get_reward_activity' : IDL.Func(
        [IDL.Principal, IDL.Vec(ActivityType), ActivitySortType],
        [IDL.Vec(PointLogOutput)],
        ['query'],
      ),
    'get_statistics' : IDL.Func([IDL.Nat64, IDL.Nat64], [Result_6], []),
    'get_top_markets' : IDL.Func(
        [TopMarketSortType, IDL.Opt(IDL.Text)],
        [TopMarketOutput],
        ['query'],
      ),
    'get_transaction_activity' : IDL.Func(
        [
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Text),
          IDL.Vec(ActivityType),
          ActivitySortType,
        ],
        [IDL.Vec(TransactionOutput)],
        ['query'],
      ),
    'get_users' : IDL.Func(
        [IDL.Nat8, IDL.Nat32],
        [IDL.Vec(User), IDL.Nat32],
        ['query'],
      ),
    'get_watchlist' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(MarketOutput)],
        ['query'],
      ),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'is_admin' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'like_comment' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'mark_market' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'remove_admin' : IDL.Func([IDL.Principal], [Result], []),
    'remove_category' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'remove_market' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'resolve_market' : IDL.Func([IDL.Text, IDL.Nat32, IDL.Text], [Result], []),
    'sell' : IDL.Func(
        [IDL.Text, IDL.Nat32, ActivityType, IDL.Nat, IDL.Nat],
        [Result],
        [],
      ),
    'signin' : IDL.Func([], [Result_7], []),
    'signup' : IDL.Func([IDL.Text, IDL.Opt(IDL.Principal)], [Result_7], []),
    'thumb_down_comment' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'thumb_up_comment' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat64], [IDL.Text, IDL.Text], []),
    'transform' : IDL.Func([TransformArgs], [HttpResponse_1], ['query']),
    'undo_resolve_market' : IDL.Func([IDL.Text], [Result], []),
    'update_balance' : IDL.Func([], [Result_8], []),
    'update_category' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [IDL.Bool, IDL.Text],
        [],
      ),
    'update_market' : IDL.Func(
        [
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Nat64),
          IDL.Opt(IDL.Vec(IDL.Text)),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Bool),
        ],
        [Result_3],
        [],
      ),
    'update_user' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Principal)],
        [Result_7],
        [],
      ),
    'upload_avatar' : IDL.Func([IDL.Text, IDL.Vec(IDL.Nat8)], [IDL.Text], []),
    'upload_market_image' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Nat8)],
        [IDL.Text],
        [],
      ),
    'user_handle_exists' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'view_notification' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'withdraw' : IDL.Func([IDL.Text, IDL.Nat64], [Result_4], []),
  });
};
export const init = ({ IDL }) => {
  const InitArg = IDL.Record({
    'minter' : IDL.Principal,
    'collector' : IDL.Principal,
    'ledger' : IDL.Principal,
  });
  return [InitArg];
};
