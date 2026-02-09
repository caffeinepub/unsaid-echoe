import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type Photo = {
    bytes : [Nat8];
    mimeType : Text;
    width : Nat;
    height : Nat;
  };

  public type DiaryEntry = {
    text : Text;
    timestamp : Int;
    photo : ?Photo;
    colorTag : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let diaryEntries = Map.empty<Principal, List.List<DiaryEntry>>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addEntry(text : Text, timestamp : Int, colorTag : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add diary entries");
    };

    let newEntry = {
      text;
      timestamp;
      photo = null;
      colorTag;
    };

    let entries = switch (diaryEntries.get(caller)) {
      case (null) { List.empty<DiaryEntry>() };
      case (?existing) { existing };
    };

    entries.add(newEntry);
    diaryEntries.add(caller, entries);
  };

  public shared ({ caller }) func addEntryWithPhoto(text : Text, timestamp : Int, photo : Photo, colorTag : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add diary entries");
    };

    let newEntry = {
      text;
      timestamp;
      photo = ?photo;
      colorTag;
    };

    let entries = switch (diaryEntries.get(caller)) {
      case (null) { List.empty<DiaryEntry>() };
      case (?existing) { existing };
    };

    entries.add(newEntry);
    diaryEntries.add(caller, entries);
  };

  public query ({ caller }) func getEntries() : async [DiaryEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get diary entries");
    };

    switch (diaryEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.toArray() };
    };
  };

  public shared ({ caller }) func deleteDiaryEntry(timestamp : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete diary entries");
    };

    let entries = switch (diaryEntries.get(caller)) {
      case (null) { Runtime.trap("No entries found for caller") };
      case (?entries) { entries };
    };

    let filteredEntries = entries.filter(
      func(entry) {
        entry.timestamp != timestamp;
      }
    );

    diaryEntries.add(caller, filteredEntries);
  };
};
