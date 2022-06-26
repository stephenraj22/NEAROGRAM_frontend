import React, { useEffect, Fragment, useState } from "react";
import "./CrowdfundDescription.scss";
import ICXGramCard from "../../styled-components/ICXGramCard";
import useAuth from "../../auth/AuthContext";
import BigText from "../../styled-components/BigText";
import SubText from "../../styled-components/SubText";
import clock from "../../assets/icons/clock.svg";
import Paragraph from "../../styled-components/Paragraph";
import TopicButton from "../../styled-components/TopicButton";
import { useLocation, useNavigate } from "react-router-dom";
import ICXGramSecondaryButton from "../../styled-components/ICXGramSecondaryButton";
import MyCrowdfunds from "../my_crowdfunds/MyCrowdfund";
import getUnfollowedTopics from "../../api/get_unfollowed_topics";
import postTopics from "../../api/set_topics";
import * as nearAPI from "near-api-js";
import * as buffer from "buffer";
(window as any).Buffer = buffer.Buffer;
function CrowdfundDescription(props: any): JSX.Element {
  console.log(props);
  const { state } = useLocation();
  const [token, setToken] = useState(localStorage.getItem("nearogram-token"));
  const [cf, setCf] = useState<any>();
  const [topics, setTopics] = useState<any[]>([]);
  const [cfId, setCfId] = useState<any[]>();
  const [accountId, setAccountID] = useState<any>(
    props.props.near.wallet.getAccountId()
  );
  const [myCf, setMyCf] = useState<any>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const contract = new nearAPI.Contract(
    props.props.near.wallet.account(),
    "crowdfund.stephenraj88.testnet",
    {
      viewMethods: ["get_cf", "get_active_cfs"],
      changeMethods: [],
    }
  );
  const errorStatus = [401, 403];
  const follow = (event: any) => {
    postTopics([event.target.id], token)
      .then((setTopicsResponse: any) => {
        if (setTopicsResponse.status === 200) {
          getUnfollowedTopics(token)
            .then((getTopicsResponse: any) => {
              setTopics(getTopicsResponse.data);
            })
            .catch((error) => {
              if (errorStatus.includes(error.response.status)) {
                logout();
              }
            });
        }
      })
      .catch((error) => {
        if (errorStatus.includes(error.response.status)) {
          logout();
        }
      });
  };
  const navigateToTransact = () => {
    cf &&
      navigate("/home/transact", {
        state: { cf_id: cfId, cf_MinAmount: cf.min_amount },
      });
  };
  const timesCalc = (current: any, previous: any) => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;
    const elapsed = current - previous;
    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + "s";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + "m";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + "h";
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + "d";
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + "mon";
    }
  };

  useEffect(() => {
    if (token) {
      getUnfollowedTopics(token)
        .then(async (getTopicsResponse: any) => {
          setTopics(getTopicsResponse.data);
          const cf = await props.props.near.contract1.get_cf({
            cf_id: Number(state),
          });
          console.log(cf);
          setCf(cf);
          setCfId(state);
        })
        .catch((error) => {
          console.log(error);
          if (errorStatus.includes(error.response.status)) {
            logout();
          }
        });
    }
  }, [state]);
  const makeInitials = (userName: any) => {
    const arr = userName.split(" ");
    if (arr.length >= 2) {
      return arr[0][0].toUpperCase() + arr[1][0].toUpperCase();
    } else {
      return arr[0][0].toUpperCase();
    }
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
  return (
    <Fragment>
      <div className="col-md-6">
        {cf && (
          <ICXGramCard className="root-card-cfdesc">
            <div
              className="row mx-0 align mb-2"
              style={{ width: "95%", paddingLeft: "30px" }}
            >
              <div className="col p-0">
                <div className="row mx-0 align-items-center">
                  <div className="col-lg-3 col-md-6 p-0">
                    <div id="profileImage">{makeInitials(cf.account_id)}</div>
                  </div>
                  <div className="col p-0">
                    <div className="row mx-0">
                      <BigText style={{ fontWeight: "600" }}>
                        {cf.account_id.split(".")[0]}
                      </BigText>
                    </div>
                    <div className="row mx-0">
                      <SubText style={{ fontSize: "14px" }}>
                        Posted in Crowdfunds
                      </SubText>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col p-0 text-right" style={{ marginTop: "15px" }}>
                <SubText style={{ fontWeight: "600" }}>
                  {timesCalc(
                    Number(new Date().getTime()),
                    Number(cf.created_at / 1000)
                  )}{" "}
                  ago
                </SubText>
              </div>
            </div>
            <div>
              <div
                style={{
                  width: "70%",
                  marginRight: "auto",
                  marginLeft: "auto",
                }}
              >
                <BigText style={{ fontWeight: "600", fontSize: "25px" }}>
                  {cf.cf_name}
                </BigText>
                <div style={{ marginTop: "10px" }}>
                  <span className="text-cfhistory" style={{ fontSize: "20px" }}>
                    <span
                      className="amount-cfhistory"
                      style={{ fontSize: "21px", fontWeight: "700px" }}
                    >
                      NEAR. {Number(cf.amount_raised).toFixed(2)}
                    </span>{" "}
                    raised out of {cf.target_value}
                  </span>
                </div>

                <div>
                  <progress
                    value={(cf.amount_raised / cf.target_value) * 100}
                    max="100"
                    style={{
                      height: "30px",
                      width: "100%",
                    }}
                  />
                </div>
                <SubText
                  style={{
                    fontWeight: "600",
                    marginLeft: "120px",
                  }}
                >
                  <img
                    src={clock}
                    style={{ marginRight: "5px", marginBottom: "3px" }}
                    width={18}
                    height={18}
                  />
                  {!cf.active
                    ? "Ended"
                    : cf.deadline / 1000 > new Date().getTime()
                    ? timesCalc(
                        cf.deadline / 1000,
                        Number(new Date().getTime())
                      ) + " left"
                    : timesCalc(
                        Number(new Date().getTime()),
                        cf.deadline / 1000
                      ) + " overdue"}{" "}
                </SubText>
              </div>
            </div>
            <div
              style={{
                marginLeft: "30px",
                marginRight: "auto",
                marginTop: "10px",
                width: "90%",
              }}
            >
              <BigText style={{ fontWeight: "600" }}>About Crowdfund</BigText>
              <div
                style={{
                  marginTop: "10px",
                }}
              >
                <Paragraph>{cf.cf_desc}</Paragraph>
              </div>
            </div>
            <div
              style={{
                width: "65%",
                marginRight: "auto",
                marginLeft: "auto",
              }}
            >
              <TopicButton
                className={cf.active ? "contribute-button" : "closed-button"}
                onClick={navigateToTransact}
                disabled={!cf.active}
              >
                {cf.active ? "Contribute" : "Closed"}
              </TopicButton>
            </div>
            <div
              style={{
                marginLeft: "30px",
                marginRight: "auto",
                marginTop: "20px",
                width: "90%",
              }}
            ></div>
          </ICXGramCard>
        )}
      </div>
      <div className="col pr-0" id="feedTopicsContainer">
        <ICXGramCard className="topics-suggestion float-right p-4">
          <div className="row mx-0 title mb-4">
            <BigText style={{ fontSize: "20px" }}>
              Topics you might like
            </BigText>
          </div>
          {topics &&
            topics.map((topic: any, index: number) => (
              <div className="row mx-0 my-2 align-items-center" key={index}>
                <div className="col pl-0">
                  <div className="row mx-0">
                    <BigText style={{ fontSize: "16px", fontWeight: "600" }}>
                      {topic.topicName}
                    </BigText>
                  </div>
                  <div className="row mx-0">
                    <SubText>{topic.nFollowers} Followers</SubText>
                  </div>
                </div>
                <div className="col text-right">
                  <ICXGramSecondaryButton id={topic._id} onClick={follow}>
                    Follow
                  </ICXGramSecondaryButton>
                </div>
              </div>
            ))}
        </ICXGramCard>
        {myCf && <MyCrowdfunds cf={myCf} />}
      </div>
    </Fragment>
  );
}

export default CrowdfundDescription;
