import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface MemoData {
  'id' : bigint,
  'title' : string,
  'body' : string,
  'last_updated' : Time,
  'created_at' : Time,
  'created_by' : Principal,
}
export type Time = bigint;
export type UpdateResponse = { 'Ok' : Time } |
  { 'Err' : string };
export interface _SERVICE {
  'change_existing_memo' : ActorMethod<
    [bigint, string, string],
    UpdateResponse,
  >,
  'clearEverything' : ActorMethod<[], undefined>,
  'create_new_memo' : ActorMethod<[string, string], UpdateResponse>,
  'get_all_memos' : ActorMethod<[], Array<MemoData>>,
}
