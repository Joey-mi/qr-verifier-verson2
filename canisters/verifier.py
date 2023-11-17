import time, secrets, math

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

from user import users
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

get_epochseconds_divisor: int = 1000000000

class VerifierCanister(Service):
    # Is user verified | fetch user data from QR code
    # verify
    @service_query
    def get_verifier(self, id: Principal) -> Opt[Verifier]:
        ...
    # function to interact and fetch scan from front end (Could be integrated into the above functions)
    @service_update
    def delete_verifier(self, id: Principal) -> GetVerifierResult:
        ...
    @service_update
    def create_verifier(self, website: str) -> Verifier:
        ...
    @service_update
    def user_of_age(self, id: Principal) -> bool:
        global get_epochseconds_divisor
        user = users.get_id(id)
        seconds_in_a_year = 31557600
        if(user):
            users_age = (math.floor(ic.time() / get_epochseconds_divisor) - user["birthdate"]) / seconds_in_a_year
    @service_query
    def caller_id(self) -> Opt[Principal]:
        ...

@query
def get_verifier(id: Principal) -> Opt[Verifier]:
    return validVerifier.get(id)
        
@update
def create_verifier(website: str) -> Verifier:
    id = ic.caller()
    verifier = Verifier = {
        "id": id,
        "created_at": ic.time(),
        "website": website,
    }
    validVerifier.insert(Verifier["id"], verifier)
    return verifier


@update
def delete_verifier(id: Principal) -> GetVerifierResult:
    verifier = validVerifier.get(id)
        
    if verifier is None:
        return {"Error": {"VerifierDoesNotExist": id}}
        
    validVerifier.remove(verifier["id"])

    return {"Ok": verifier}

@query
def caller_id() -> Principal:
    return ic.caller()

def generate_id() -> Principal:
    random_bytes = secrets.token_bytes(29)

    return Principal.from_hex(random_bytes.hex())