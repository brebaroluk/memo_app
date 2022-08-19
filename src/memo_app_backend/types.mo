import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Text "mo:base/Text";
module {
    public type Time = Int;
    public type MemoData = {
        title: Text;
        body: Text;
        id: Nat;
        created_by: Principal;
        created_at: Time;
        last_updated : Time;
    };
    public type UpdateResponse = {
        #Ok : Time;
        #Err : Text;
    };
};