# qr-verifier-verson2
## Hackathon Project for ChainShift

### Description:
Seeks to create an application where a user can verify sensitive information such as their age without
needing to reveal the exact details of the information.

### Currently implemented:
QR Code generation

### Need to implement:
QR Code scanner

Instructions:

1. Follow the instructions [here](https://demergent-labs.github.io/kybra/installation.html) to install the required dependencies
2. Install Rust
3. Run the folloing command `dfx deps pull` to grab the canister which handles authentication
4. Initialize theii_integration canister `dfx deps init internet_identity --argument '(null)'`
5. Install required packages `npm install @dfinity/auth-client` and `npm install @dfinity/agent`
6. Generate require files with `dfx generate`
7. Use the following code `cp src/declarations/{insert folder here}/* .dfx/local/canisters/{insert folder here}/` for all folders in src/declarations
8. Start deploying the application to your local machien with `dfx start --background`
9. Run `dfx deploy` and `npm run dev`
10. Navigate to http://127.0.0.1:4943/?canisterId=<canister-id>, replace <canisterId> with the generated id of the front-end canister
11. Application should be launched a this point
