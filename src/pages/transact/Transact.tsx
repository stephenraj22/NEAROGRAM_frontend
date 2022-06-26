import React, { useEffect, useState, useRef } from "react";
import "./Transact.scss";
import ICXGramCard from "../../styled-components/ICXGramCard";
import InputBox from "../../styled-components/InputBox";
import TopicButton from "../../styled-components/TopicButton";
import dropdown from "../../assets/icons/dropdown.svg";
import { useLocation } from "react-router-dom";
import * as nearAPI from "near-api-js";
import * as buffer from "buffer";
(window as any).Buffer = buffer.Buffer;
const { keyStores, connect } = nearAPI;
function Transact(props: any): JSX.Element {
  console.log(props);
  const { state } = useLocation();
  const [balance, setBalance] = useState<any>(0);
  const [token, setToken] = useState(localStorage.getItem("nearogram-token"));
  const amount = useRef<any>(null);
  const cfId = useRef<any>(null);
  const [walletName, setWalletName] = useState("Main Wallet");
  const [err, setErr] = useState("");
  const [btnFlag, setBtnFlag] = useState<any>(false);
  const updateBalance = async () => {
    const config = {
      networkId: "testnet",
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
      headers: {},
    };
    const near = await connect(config);
    const account = await near.account(
      props.walletCon.near.wallet.getAccountId()
    );
    setBalance(
      Number(await (await account.getAccountBalance()).available) / 10 ** 24
    );
  };

  const transactPost = () => {
    if (
      amount.current.value &&
      cfId.current.value &&
      Number(amount.current.value) > 0
    ) {
      setBtnFlag(true);
      const num = Number(amount.current.value) * 10 ** 24;
      const numString = num.toLocaleString("fullwide", { useGrouping: false });
      props.walletCon.near.contract1
        .contribute(
          {
            account_id: props.walletCon.near.wallet.getAccountId(),
            amount: Number(amount.current.value),
            cf_id: Number(cfId.current.value),
            created_at: new Date().getTime() * 1000,
          },
          "300000000000000", // attached GAS (optional)
          numString
        )
        .then((getTrasactResponse: any) => {
          setErr(getTrasactResponse);
        })
        .catch((error: any) => {
          setBtnFlag(false);
          setErr(error);
        });
    } else {
      setErr("Parameters are incorrect!");
    }
  };
  useEffect(() => {
    if (token) {
      updateBalance();
    }
    if (state) {
      amount.current.value = state.cf_MinAmount;
      cfId.current.value = state.cf_id;
    }
  }, [props]);
  return (
    <div className="col p-0">
      <ICXGramCard className="root-card-transact">
        <div className="root-div-transact">
          <div className="input-div">
            <div style={{ height: "60px" }}></div>
            <span className="title-bold-transact">Transact</span>
            <div className="error-transact">
              <span className="span-err">{err}</span>
            </div>
            <InputBox
              placeholder="Enter the amount"
              className="amount-input-transact"
              ref={amount}
            />
            <InputBox
              placeholder="Enter the receiver nearogram CF Id"
              className="email-input-transact"
              ref={cfId}
            />
            <TopicButton
              style={{
                width: "200px",
                height: "40px",
                fontSize: "20px",
                fontWeight: "700",
                paddingBottom: "35px",
              }}
              className="pay-button"
              onClick={transactPost}
              disabled={btnFlag}
            >
              Pay
            </TopicButton>
          </div>
          <div className="vertical-line"></div>
          <div className="select-wallet">
            <div className="space-transact"></div>
            <div>
              <span className="span-title">From the account</span>
            </div>
            <div style={{ marginTop: "10px" }}>
              <span className="span-wallet">
                {walletName}
                <button
                  style={{ backgroundColor: "transparent", marginLeft: "10px" }}
                >
                  <img src={dropdown} width={20} height={20} />
                </button>
              </span>
            </div>
            <div style={{ marginTop: "5px" }}>
              <span className="span-balance">
                Balance NEAR. {Number(balance)?.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </ICXGramCard>
    </div>
  );
}

export default Transact;
