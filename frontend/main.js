import * as counter from "../.dfx/local/canisters/counter"
import "./style.css"
import {
  createActor,
  ii_integration,
} from "../src/declarations/ii_integration";

userCan = userCanister(
  Principal.from_str("be2us-64aaa-aaaaa-qaabq-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai")
)

import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "azle";
let actor = ii_integration;

console.log(process.env.CANISTER_ID_INTERNET_IDENTITY);
const whoAmIButton = document.getElementById("whoAmI");

whoAmIButton.onclick = async (e) => {
  e.preventDefault();
  whoAmIButton.setAttribute("disabled", true);
  const principal = await actor.whoami();
  whoAmIButton.removeAttribute("disabled");
  document.getElementById("principal").innerText = principal.toString();
  return false;
};

const loginButton = document.getElementById("login");
loginButton.onclick = async (e) => {
    e.preventDefault();
    let authClient = await AuthClient.create();
    // start the login process and wait for it to finish
    await new Promise((resolve) => {
        authClient.login({
            identityProvider:
                process.env.DFX_NETWORK === "ic"
                    ? "https://identity.ic0.app"
                    : `http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`,
            onSuccess: resolve,
        });
    });
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    actor = createActor(process.env.CANISTER_ID_II_INTEGRATION, {
        agent,
    });
    return false;
};

// document.querySelector("#app").innerHTML = `
//   <img src="logo2.svg" alt="DFINITY logo" />
//   <br />
//   <br />
//   <form>
//     <button id="login">Login!</button>
//   </form>
//   <br />
//   <form>
//     <button id="whoAmI">Who Am I</button>
//   </form>
//   <section id="principal"></section>
`
// document.querySelector("#app").innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `
