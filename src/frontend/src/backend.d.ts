import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DiaryEntry {
    text: string;
    colorTag: string;
    timestamp: bigint;
    photo?: Photo;
}
export interface UserProfile {
    name: string;
}
export interface Photo {
    height: bigint;
    mimeType: string;
    bytes: Uint8Array;
    width: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEntry(text: string, timestamp: bigint, colorTag: string): Promise<void>;
    addEntryWithPhoto(text: string, timestamp: bigint, photo: Photo, colorTag: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteDiaryEntry(timestamp: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEntries(): Promise<Array<DiaryEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
