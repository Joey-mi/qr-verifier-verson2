import time, secrets, math

from kybra import (
    Async,
    query,
    update,
    Principal,
    Opt,
    Vec,
    nat64,
    int8,
    float64,
    text,
    StableBTreeMap,
    Record,
    Variant,
    Service,
    ic,
    init,
    post_upgrade,
    void,
    service_update,
    service_query,
    CallResult,
    Duration,
    TimerId,
)

get_epochseconds_divisor: int = 1000000000

# Define User record
class User(Record):
    id: Principal
    created_at: nat64
    birthdate: nat64
    updated_at: Opt[nat64]

class UpdateUserErr(Variant, total=False):
    UserDoesNotExist: Principal

class UpdateUserResult(Variant, total=False):
    Ok: User
    Err: "UpdateUserErr"

users = StableBTreeMap[Principal, User](
    memory_id=3, max_key_size=38, max_value_size=5_000_000
)

class GetUserAgeResult(Variant, total=False):
    Ok: int8
    Err: "GetUserErr"

class GetUserErr(Variant, total=False):
    UserDoesNotExist: Principal


# This won't properly build cause nothing in it
class UserCanister(Service):
    # define interface of the functions of the canister
    @service_update
    def create_user(self, birthdate: nat64) -> Principal:
        ...

    @service_query
    def get_user(self, identity: Principal) -> Opt[User]:
        ...

    @service_query
    def get_users(self) -> Vec[User]:
        ...

    @service_query
    def get_age(self, id: Principal) -> GetUserAgeResult:
        ...

    @service_query
    def test_time(self) -> nat64:
        ...

    # Create User | Will fetch user id from whoami

    # Create QR code | QR code base will be on internet identiy or just ic.caller() rn

    # login

    # Fetch QR code | From here fetch age data or return a bool

# Down here define how the functions work
@update
def create_user(birthdate: nat64) -> Principal:
    global get_epochseconds_divisor

    created = math.floor(ic.time() / get_epochseconds_divisor)

    id = generate_id()
   
    user: User = {
        "id": id,
        "created_at": created,
        "birthdate": birthdate,
        "updated_at": None
    }

    users.insert(user["id"], user)

    return user["id"]

@query
def get_user(identity: Principal) -> Opt[User]:
    return users.get(identity)

@query
def get_users() -> Vec[User]:
    return users.values()

@query
def get_age(id: Principal) -> GetUserAgeResult:
    global get_epochseconds_divisor
    user = users.get(id)

    if user is None:
        return {"Err": {"GetUserErr": id}}

    seconds_in_a_year = 31557600

    users_age = (math.floor(ic.time() / get_epochseconds_divisor) - user["birthdate"]) / seconds_in_a_year
    
    return {"Ok": int(users_age)}

@query
def test_time() -> nat64:
    global get_epochseconds_divisor
    return math.floor(ic.time() / get_epochseconds_divisor)


def generate_id() -> Principal:
    random_bytes = secrets.token_bytes(29)

    return Principal.from_hex(random_bytes.hex())

