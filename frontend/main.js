import * as counter from "../.dfx/local/canisters/counter"
import "./style.css"
import {
  createActor,
  ii_integration,
} from "../src/declarations/ii_integration";
import {
  createActor as createVerifierActor,
  verifier,
} from "../src/declarations/verifier";


import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";

let actor = ii_integration;
let verifierActor = verifier;

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


async function setDynamicUser() {
  let userPrincipal;
  let userAge;
  // try {
  // // userPrincipal = await verifierActor.create_verifier("hehee");
  // } catch (error) {
  //   console.error("Error:", error);
  // }

  verifierActor.create_verifier("hehee").then((record) => {
    // Access the <p></p> tag using its id
    record.created_at = record.created_at.toString();
    const hTag = document.getElementById("userTest");
  
    // Set the innerHTML of the <p></p> tag to the record object
    hTag.innerHTML = JSON.stringify(record);
  }).catch((error) => {
    console.error(error);
  });

  // try {
  //   userAge = await userActor.get_age(userPrincipal);
  // } catch (error) {
  //   console.error("Error:", error);
  // }

  // document.getElementById('userTest').textContent = userPrincipal.toString();
}

document.addEventListener('DOMContentLoaded', setDynamicUser);
// document.querySelector('#app').innerHTML = 
//   <h1> userActor.create </h1>


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

// document.querySelector("#app").innerHTML = 
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `
