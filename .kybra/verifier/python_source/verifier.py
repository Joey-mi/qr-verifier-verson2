import secrets

from kybra import (
    query,
    update, 
    void, 
    Record, 
    Principal, 
    nat64, 
    Opt, 
    blob,
    StableBTreeMap,
    Service,
    ic,
    service_update,
    service_query,
    Variant
)

# from whoami import generate_id

class Verifier(Record):
    id: Principal
    created_at: nat64
    website: str

validVerifier = StableBTreeMap[Principal, Verifier](
    memory_id=4, max_key_size=38, max_value_size=5_000_000
)

class GetVerifierResult(Variant, total=False):
    Ok: Verifier
    Err: "GetVerifierErr"

class GetVerifierErr(Variant, total=False):
    VerifierDoesNotExist: Principal

# This won't properly build cause nothing in it
class VerifierCanister(Service):
    # Is user verified | fetch user data from QR code
    # verify
    @service_query
    def get_verifier(self, id: Principal) -> Opt[Verifier]:
        ...
    # function to interact and fetch scan from front end (Could be integrated into the above functions)
    @service_update
    def delete_user(self, id: Principal) -> GetVerifierResult:
        ...
    @service_update
    def create_verifier(self, website: str) -> Verifier:
        ...

@query
def get_verifier(id: Principal) -> Opt[Verifier]:
    return validVerifier.get(id)
        
@update
def create_verifier(website: str) -> Verifier:
    id = generate_id()
    verifier = Verifier = {
        "id": id,
        "created_at": ic.time(),
        "website": website,
    }
    validVerifier.insert(Verifier["id"], verifier)
    return verifier


@update
def delete_user(id: Principal) -> GetVerifierResult:
    verifier = validVerifier.get(id)
        
    if verifier is None:
        return {"Error": {"VerifierDoesNotExist": id}}
        
    validVerifier.remove(verifier["id"])

    return {"Ok": verifier}


def generate_id() -> Principal:
    random_bytes = secrets.token_bytes(29)

    return Principal.from_hex(random_bytes.hex())
