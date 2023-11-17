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
  return IDL.Service({
    'create_verifier' : IDL.Func([IDL.Text], [Verifier], []),
    'delete_user' : IDL.Func([IDL.Principal], [GetVerifierResult], []),
    'get_verifier' : IDL.Func([IDL.Principal], [IDL.Opt(Verifier)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
