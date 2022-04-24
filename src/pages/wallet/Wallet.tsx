import React, { useEffect, useState } from "react";
import useAuth from "../../auth/AuthContext";
import "./Wallet.scss";
import ICXGramCard from "../../styled-components/ICXGramCard";
import TopicButton from "../../styled-components/TopicButton";
import dropdown from "../../assets/icons/dropdown.svg";
import arrowup from "../../assets/icons/arrowup.svg";
import { useLocation, useNavigate } from "react-router-dom";

function Wallet(props: any): JSX.Element {
  console.log(props);
  console.log(props.props.near.currentUser.accountId);
  const { state } = useLocation();
  const [token, setToken] = useState(localStorage.getItem("nearogram-token"));
  const [cf, setCf] = useState<any>(null);
  const [earn, setEarn] = useState<any>(null);
  const [walletName, setWalletName] = useState("Main Wallet");
  const navigate = useNavigate();
  const navigateToTransact = () => {
    cf &&
      navigate("/home/transact", {
        state: { cf_id: state, cf_MinAmount: cf.min_amount },
      });
  };
  const earnings = async () => {
    const val = await props.props.near.contract.get_earnings_by_account({
      account: props.props.near.wallet.getAccountId(),
    });
    console.log(val);
    setEarn(val);
  };
  const withdraw = () => {
    props.props.near.contract
      .withdraw(
        {
          account_id: props.props.near.currentUser.accountId,
        },
        "300000000000000"
      )
      .then((res: any) => {
        console.log(res);
        navigate("/home/feed");
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const getCf = async (state: any) => {
    const cf = await props.props.near.contract.get_cf({
      cf_id: Number(state),
    });
    setCf(cf);
    console.log(cf);
  };
  const timeConvertor = (UNIX_timestamp: any) => {
    const a = new Date(UNIX_timestamp / 1000);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const time =
      a.getDate() +
      " " +
      months[a.getMonth()] +
      " " +
      a.getFullYear() +
      " " +
      a.getHours() +
      ":" +
      a.getMinutes() +
      ":" +
      a.getSeconds();
    return time;
  };
  useEffect(() => {
    earnings();
    console.log(earn);
    if (token) {
      if (state) {
        getCf(state);
      }
      setWalletName("Main Wallet");
    }
  }, []);
  return (
    <div className="col p-0">
      <ICXGramCard className="card-style">
        <div className="container">
          <div className="row" style={{ display: "flex", marginTop: "25px" }}>
            <div style={{ width: "50%" }}>
              <span className="wallet-title-wallet">{cf && cf.cf_name}</span>
            </div>
            <div className="span-wallet-wallet-div" style={{ width: "50%" }}>
              <span className="span-wallet-wallet">
                {walletName}
                <button
                  style={{ backgroundColor: "transparent", marginLeft: "10px" }}
                >
                  <img
                    className="mr-2"
                    src={dropdown}
                    style={{ backgroundColor: "transparent" }}
                    width={20}
                    height={20}
                  />
                </button>
              </span>
            </div>
          </div>
          <div className="span-balance-wallet-div row">
            <span className="span-balance-wallet">
              NEAR.
              {Number(earn).toFixed(4)}
            </span>
          </div>
          <div className="row">
            <span className="span-totalbalance-wallet">Total Balance</span>
          </div>
          <div className="row">
            <div className="horizontal-line-wallet"></div>
          </div>
          <div className="row">
            <span className="span-transaction-wallet">Transaction History</span>
          </div>
          <div className="row">
            <div
              className="div-table-wallet"
              style={{ overflow: "auto", maxHeight: "250px" }}
            >
              <table className="table table-borderless">
                <thead></thead>
                <tbody>
                  {cf &&
                    cf.donars.map((transaction: any) => (
                      <tr key={transaction.txHash}>
                        <td width="1">
                          <img
                            className="mr-2"
                            src={arrowup}
                            style={{ backgroundColor: "transparent" }}
                            width={40}
                            height={40}
                          />
                        </td>
                        <td>
                          <div style={{ lineHeight: "19px" }}>
                            <div>
                              <span className="credit-debit-wallet">
                                {"Credit"}
                              </span>
                            </div>
                            <div>
                              {
                                <span className="sender-receiver-wallet">
                                  Sender:{" "}
                                  <span className="username-wallet">
                                    {transaction.account_id.split(".")[0]}
                                  </span>
                                </span>
                              }
                            </div>
                            <div>
                              <span className="sender-receiver-wallet">
                                {timeConvertor(transaction.created_at)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td
                          colSpan={5}
                          align="right"
                          className={"amount-wallet-credit"}
                        >
                          NEAR. {Number(transaction.amount).toFixed(4)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "20px",
              }}
            >
              <TopicButton
                className="deposit-withdraw-transact"
                disabled={cf && !cf.active}
                onClick={navigateToTransact}
              >
                Deposit
              </TopicButton>
              <TopicButton
                className="deposit-withdraw-transact"
                disabled={cf && cf.active}
                onClick={withdraw}
              >
                Withdraw
              </TopicButton>
            </div>
          </div>
        </div>
      </ICXGramCard>
    </div>
  );
}

export default Wallet;
