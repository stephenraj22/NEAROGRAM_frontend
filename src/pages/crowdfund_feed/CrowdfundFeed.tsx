import React, { Fragment, useState, useEffect } from "react";
import useAuth from "../../auth/AuthContext";
import ICXGramCard from "../../styled-components/ICXGramCard";
import BigText from "../../styled-components/BigText";
import SubText from "../../styled-components/SubText";
import ICXGramSecondaryButton from "../../styled-components/ICXGramSecondaryButton";
import Paragraph from "../../styled-components/Paragraph";
import getUnfollowedTopics from "../../api/get_unfollowed_topics";
import postTopics from "../../api/set_topics";
import clock from "../../assets/icons/clock.svg";
import { Route, useNavigate } from "react-router-dom";
import MyCrowdfunds from "../my_crowdfunds/MyCrowdfund";
import * as buffer from "buffer";
(window as any).Buffer = buffer.Buffer;
function CrowdfundingFeed(props: any): JSX.Element {
  console.log(props);
  const [token, setToken] = useState(localStorage.getItem("nearogram-token"));
  const [topics, setTopics] = useState<any[]>([]);
  const [cfs, setCfs] = useState<any[]>([]);
  const [cf_ids, setCfIds] = useState<any[]>([]);
  const [cf, setCf] = useState<any>();
  const { logout } = useAuth();
  const errorStatus = [401, 403];
  const navigate = useNavigate();
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
  const makeInitials = (userName: any) => {
    const arr = userName.split(" ");
    if (arr.length >= 2) {
      return arr[0][0].toUpperCase() + arr[1][0].toUpperCase();
    } else {
      return arr[0][0].toUpperCase();
    }
  };
  const navigateToDesc = (event: any) => {
    event.target.id &&
      navigate(`/home/crowdfundDescription`, { state: event.target.id });
  };
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
  useEffect(() => {
    if (token) {
      console.log();
      getUnfollowedTopics(token)
        .then(async (getTopicsResponse: any) => {
          const cfs = await props.props.near.contract.get_active_cfs();
          setCfs(cfs.crowdfunds);
          setCfIds(cfs.cf_ids);
          setTopics(getTopicsResponse.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  return (
    <Fragment>
      <div className="col-md-6" style={{ overflow: "auto", height: "600px" }}>
        {cfs &&
          cfs.map((cf: any, idx: number) => (
            <ICXGramCard
              className="mb-3"
              style={{ padding: "25px" }}
              key={idx}
              id={cf_ids[idx]}
              onClick={navigateToDesc}
            >
              <div className="row mx-0 align mb-2">
                <div className="col p-0">
                  <div className="row mx-0 align-items-center">
                    <div className="col-lg-3 col-md-6 p-0">
                      <div id="profileImage">{makeInitials(cf.account_id)}</div>{" "}
                    </div>
                    <div className="col p-0">
                      <div className="row mx-0">
                        <BigText style={{ fontWeight: "600" }}>
                          {cf.account_id.split(".")[0]}
                        </BigText>
                      </div>
                      <div className="row mx-0">
                        <SubText style={{ fontSize: "14px" }}>
                          Posted in NEAROGRAM Crowdfunds
                        </SubText>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col p-0 text-right">
                  <SubText style={{ fontWeight: "600" }}>
                    {timesCalc(
                      Number(new Date().getTime()),
                      Number(cf.created_at / 1000)
                    )}{" "}
                    ago
                  </SubText>
                </div>
              </div>
              <div className="row mx-0 mb-2">
                <BigText style={{ fontWeight: "600" }}>{cf.cf_name}</BigText>
              </div>
              <div className="row mx-0 mb-2">
                <Paragraph>{cf.cf_desc}</Paragraph>
              </div>
              <div className="row mx-0 mb-2" style={{ marginTop: "10px" }}>
                <span className="text-cfhistory" style={{ fontSize: "20px" }}>
                  <span
                    className="amount-cfhistory"
                    style={{ fontSize: "21px", fontWeight: "700px" }}
                  >
                    Near. {Number(cf.amount_raised).toFixed(2)}
                  </span>{" "}
                  raised out of {cf.target_value}
                </span>
                {
                  <div className="col p-0 text-right">
                    <SubText
                      style={{
                        fontWeight: "600",
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
                }
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
            </ICXGramCard>
          ))}
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
        {cf && <MyCrowdfunds cf={cf} />}
      </div>
    </Fragment>
  );
}

export default CrowdfundingFeed;
