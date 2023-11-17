import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type GetUserAgeResult = { 'Ok' : number } |
  { 'Err' : GetUserErr };
export type GetUserErr = { 'UserDoesNotExist' : Principal };
export interface User {
  'id' : Principal,
  'updated_at' : [] | [bigint],
  'birthdate' : bigint,
  'created_at' : bigint,
}
export interface _SERVICE {
  'create_user' : ActorMethod<[bigint], [Principal]>,
  'get_age' : ActorMethod<[Principal], GetUserAgeResult>,
  'get_user' : ActorMethod<[Principal], [] | [User]>,
  'get_users' : ActorMethod<[], Array<User>>,
  'test_time' : ActorMethod<[], bigint>,
}
