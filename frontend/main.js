import * as counter from "../.dfx/local/canisters/counter"
import "./style.css"
import {
  createActor,
  ii_integration,
} from "../src/declarations/ii_integration";
import {
  createActor as createUserActor,
  user,
} from "../src/declarations/user";


import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";

let qrBox = document.getElementById("qrcontainer");
let qrImage = document.getElementById("qrImage");

let actor = ii_integration;
let userActor = user;

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
            onSuccess: () => {
              // Login success callback
              console.log("Login successful");
              var hiddenElement = document.getElementById('qrcontainer');
              hiddenElement.style.display = 'block';

              generateQr();
              // Perform any additional actions here
              resolve();
          },
        });
    });
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    actor = createActor(process.env.CANISTER_ID_II_INTEGRATION, {
        agent,
    });
    return false;
};

async function generateQr() {
  let userPrincipal = await actor.whoami();
  userActor.get_user(userPrincipal).then((record) => {
    qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + userPrincipal;
  }).catch((error) => {
    var revealForm = document.getElementById("hiddenform");
    revealForm.style.display = 'block';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const formElement = document.getElementById('hiddenform');
  const genBirthdayInput = document.getElementById('genBirthday');

  // Add an event listener for form submission
  formElement.addEventListener('submit', handleSubmit);

  // Function to be called on form submission
  async function handleSubmit(event) {
      event.preventDefault(); // Prevent the default form submission behavior

      // Access the entered date value
      const enteredDate = new Date(genBirthdayInput.value);

      // Get the timestamp in milliseconds
      const timestampMilliseconds = enteredDate.getTime();

      // Convert milliseconds to seconds (divide by 1000)
      const timestampSeconds = Math.floor(timestampMilliseconds / 1000);

      let userPrincipal = await actor.whoami();
      try {
        let userPrincipal = await userActor.create_user(timestampSeconds, userPrincipal);
      } catch (error) {
        console.error("Error creating user:", error);
      }

      qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + userPrincipal;
      // Add your code here to handle the birthday input
      // console.log(`Birthday entered: ${enteredDate}`);
      // alert(`Birthday entered: ${enteredDate}`);
  }
});
// async function setDynamicUser() {
//   verifierActor.create_verifier("hehee").then((record) => {
//     // Access the <p></p> tag using its id
//     record.created_at = record.created_at.toString();
//     const hTag = document.getElementById("userTest");
  
//     // Set the innerHTML of the <p></p> tag to the record object
//     hTag.innerHTML = JSON.stringify(record);
//   }).catch((error) => {
//     console.error(error);
//   });

// };

// document.addEventListener('DOMContentLoaded', setDynamicUser);


