import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as nearAPI from "near-api-js";
import * as buffer from "buffer";
(window as any).Buffer = buffer.Buffer;
const { keyStores, connect, transactions, WalletConnection } = nearAPI;

async function initContract() {
  const config = {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
    headers: {},
  };

  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  const near = await nearAPI.connect(config);

  const walletConnection = new nearAPI.WalletConnection(near, "nearogram");

  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    };
  }

  const contract = await new nearAPI.Contract(
    walletConnection.account(),

    "nftmarket.powertofly22.testnet",
    {
      viewMethods: [
        "get_nfts_by_account",
        "get_earnings_by_account",
        "get_creators",
      ],
      changeMethods: ["make_creator", "mint", "put_in_sale", "withdraw"],
    }
  );

  return { contract, currentUser, config, walletConnection };
}
initContract().then(({ contract, currentUser, config, walletConnection }) => {
  console.log(currentUser);
  ReactDOM.render(
    <React.StrictMode>
      <App
        contract={contract}
        currentUser={currentUser}
        nearConfig={config}
        wallet={walletConnection}
      />
    </React.StrictMode>,
    document.getElementById("root")
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
