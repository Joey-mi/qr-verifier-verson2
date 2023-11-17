import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type GetVerifierErr = { 'VerifierDoesNotExist' : Principal };
export type GetVerifierResult = { 'Ok' : Verifier } |
  { 'Err' : GetVerifierErr };
export interface Verifier {
  'id' : Principal,
  'created_at' : bigint,
  'website' : string,
}
export interface _SERVICE {
  'create_verifier' : ActorMethod<[string], Verifier>,
  'delete_user' : ActorMethod<[Principal], GetVerifierResult>,
  'get_verifier' : ActorMethod<[Principal], [] | [Verifier]>,
}
