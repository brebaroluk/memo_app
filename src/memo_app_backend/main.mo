import Types "types";
import Buffer "mo:base/Buffer";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Prelude "mo:base/Prelude";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
actor BackendCanister {

  //Type declarations
	public type MemoData = Types.MemoData;
	public type UpdateResponse = Types.UpdateResponse;

  //holds the total memo count
	private stable var _total_memo_count : Nat = 0;
  //To ensure that there is no data loss after the canister code is upgraded, the data in the hashmap is transferred here before the upgrade and fetch from here after the upgrade.
	private stable var memo_datas_entries : [(Nat, MemoData)] = [];
  //holds the memo_datas with unique ids
	private let memo_datas : HashMap.HashMap<Nat, MemoData> = HashMap.fromIter<Nat, MemoData>(memo_datas_entries.vals(), 10, Nat.equal, Hash.hash);

  //query method returning all memos as an array
	public shared query func get_all_memos() : async [MemoData]{
		let memos_buffer = Buffer.Buffer<MemoData>(0);
		for(id in memo_datas.keys()){
			memos_buffer.add(_get_memo_with_id(id));
		};
		return memos_buffer.toArray();
	};

  //upgrade method that takes two Texts title and body as arguments and creates a new memo
	public shared (msg) func create_new_memo(title: Text, body: Text):async UpdateResponse{
		if(Text.equal("", title) or Text.equal("", body)){
			return #Err("Title or body is empty.");
		};
		let created_memo_id = _increment_total_memo_count();
		memo_datas.put(created_memo_id, {
			title = title;
        	body = body;
        	id = created_memo_id;
        	created_by = msg.caller;
        	created_at = Time.now();
        	last_updated = Time.now();
		});
		return #Ok(Time.now());
	};


  //upgrade method that takes 3 arguments named title, body and id and update an existing memo
	public shared (msg) func change_existing_memo(id: Nat, title: Text, body: Text):async UpdateResponse{
		if(Nat.greater(id,_total_memo_count)){
			return #Err("There is no memo with this id!!!");
		};
		if(Text.equal("", title) or Text.equal("", body)){
			return #Err("Title or body is empty.");
		};
		let unchanged_memo = _get_memo_with_id(id);
		if(unchanged_memo.created_by != msg.caller){
			return #Err("Unauthorized caller!");
		};
		memo_datas.put(id, {
			title = title;
        	body = body;
        	id = id;
        	created_by = msg.caller;
        	created_at = unchanged_memo.created_at;
        	last_updated = Time.now();
		});
		return #Ok(Time.now());
	};

  //deletes all memos
  //NOT IMPLEMENTED ON FRONTEND
  public shared func clearEverything():async(){
		_total_memo_count := 0;
		memo_datas_entries := [];
		for(i in memo_datas.keys()){
			ignore memo_datas.remove(i);
		};
	};

  //INTERNAL

	private func _increment_total_memo_count() : Nat{
		_total_memo_count+=1;
		return _total_memo_count;
	};
	

	private func _get_memo_with_id(id:Nat) : MemoData{
		switch (memo_datas.get(id)) {
			case null {
				Prelude.unreachable()
			};
			case (?data) {
				data
			};
		};
	};

  //System function that moves all data to stable variable memo_datas_entries before upgrading the canister code
	system func preupgrade() {
		memo_datas_entries := Iter.toArray(memo_datas.entries());
	};
	
  //clears the memo_datas_entries array after the canister code upgrade process
	system func postupgrade() {
		memo_datas_entries := [];
	};
}