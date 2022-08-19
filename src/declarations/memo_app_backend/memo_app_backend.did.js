export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const UpdateResponse = IDL.Variant({ 'Ok' : Time, 'Err' : IDL.Text });
  const MemoData = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'body' : IDL.Text,
    'last_updated' : Time,
    'created_at' : Time,
    'created_by' : IDL.Principal,
  });
  return IDL.Service({
    'change_existing_memo' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text],
        [UpdateResponse],
        [],
      ),
    'clearEverything' : IDL.Func([], [], []),
    'create_new_memo' : IDL.Func([IDL.Text, IDL.Text], [UpdateResponse], []),
    'get_all_memos' : IDL.Func([], [IDL.Vec(MemoData)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
