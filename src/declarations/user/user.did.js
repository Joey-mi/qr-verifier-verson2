export const idlFactory = ({ IDL }) => {
  const User = IDL.Record({
    'id' : IDL.Principal,
    'updated_at' : IDL.Opt(IDL.Nat64),
    'birthdate' : IDL.Nat64,
    'created_at' : IDL.Nat64,
  });
  const GetUserErr = IDL.Variant({ 'UserDoesNotExist' : IDL.Principal });
  const GetUserAgeResult = IDL.Variant({ 'Ok' : IDL.Int8, 'Err' : GetUserErr });
  return IDL.Service({
    'create_user' : IDL.Func([IDL.Nat64], [User], []),
    'get_age' : IDL.Func([IDL.Principal], [GetUserAgeResult], ['query']),
    'get_user' : IDL.Func([IDL.Principal], [IDL.Opt(User)], ['query']),
    'get_users' : IDL.Func([], [IDL.Vec(User)], ['query']),
    'test_time' : IDL.Func([], [IDL.Nat64], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
