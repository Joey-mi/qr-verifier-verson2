export const idlFactory = ({ IDL }) => {
  const Verifier = IDL.Record({
    'id' : IDL.Principal,
    'created_at' : IDL.Nat64,
    'website' : IDL.Text,
  });
  const GetVerifierErr = IDL.Variant({
    'VerifierDoesNotExist' : IDL.Principal,
  });
  const GetVerifierResult = IDL.Variant({
    'Ok' : Verifier,
    'Err' : GetVerifierErr,
  });
  const GetUserErr = IDL.Variant({ 'UserDoesNotExist' : IDL.Principal });
  const GetUserAgeResult = IDL.Variant({ 'Ok' : IDL.Int8, 'Err' : GetUserErr });
  const User = IDL.Record({
    'id' : IDL.Principal,
    'updated_at' : IDL.Opt(IDL.Nat64),
    'birthdate' : IDL.Nat64,
    'created_at' : IDL.Nat64,
  });
  return IDL.Service({
    'caller_id' : IDL.Func([], [IDL.Principal], ['query']),
    'create_user' : IDL.Func([IDL.Nat64, IDL.Principal], [IDL.Principal], []),
    'create_verifier' : IDL.Func([IDL.Text], [Verifier], []),
    'delete_verifier' : IDL.Func([IDL.Principal], [GetVerifierResult], []),
    'get_age' : IDL.Func([IDL.Principal], [GetUserAgeResult], ['query']),
    'get_user' : IDL.Func([IDL.Principal], [IDL.Opt(User)], ['query']),
    'get_users' : IDL.Func([], [IDL.Vec(User)], ['query']),
    'get_verifier' : IDL.Func([IDL.Principal], [IDL.Opt(Verifier)], ['query']),
    'test_time' : IDL.Func([], [IDL.Nat64], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
