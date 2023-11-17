import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type GetUserAgeResult = { 'Ok' : number } |
  { 'Err' : GetUserErr };
export type GetUserErr = { 'UserDoesNotExist' : Principal };
export type GetVerifierErr = { 'VerifierDoesNotExist' : Principal };
export type GetVerifierResult = { 'Ok' : Verifier } |
  { 'Err' : GetVerifierErr };
export interface User {
  'id' : Principal,
  'updated_at' : [] | [bigint],
  'birthdate' : bigint,
  'created_at' : bigint,
}
export interface Verifier {
  'id' : Principal,
  'created_at' : bigint,
  'website' : string,
}
export interface _SERVICE {
  'caller_id' : ActorMethod<[], Principal>,
  'create_user' : ActorMethod<[bigint, Principal], Principal>,
  'create_verifier' : ActorMethod<[string], Verifier>,
  'delete_verifier' : ActorMethod<[Principal], GetVerifierResult>,
  'get_age' : ActorMethod<[Principal], GetUserAgeResult>,
  'get_user' : ActorMethod<[Principal], [] | [User]>,
  'get_users' : ActorMethod<[], Array<User>>,
  'get_verifier' : ActorMethod<[Principal], [] | [Verifier]>,
  'test_time' : ActorMethod<[], bigint>,
}
