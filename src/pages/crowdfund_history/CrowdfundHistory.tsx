import React, { useEffect, Fragment, useState } from "react";
import "./CrowdfundHistory.scss";
import ICXGramCard from "../../styled-components/ICXGramCard";
import useAuth from "../../auth/AuthContext";
import getMyCrowdfunds from "../../api/get_my_crowdfunds";
import ICXGramSecondaryButton from "../../styled-components/ICXGramSecondaryButton";
import SubText from "../../styled-components/SubText";
import BigText from "../../styled-components/BigText";
import MyCrowdfunds from "../my_crowdfunds/MyCrowdfund";
import getCrowdfunds from "../../api/get_crowd_funds";
import getMyLatestCrowdfunds from "../../api/get_latest_crowdfund";
import getUnfollowedTopics from "../../api/get_unfollowed_topics";
import postTopics from "../../api/set_topics";

function CrowdfundHistory(): JSX.Element {
  const { logout } = useAuth();
  const [token, setToken] = useState(localStorage.getItem("nearogram-token"));
  const [topics, setTopics] = useState<any[]>([]);
  const [cfs, setCfs] = useState<any[]>([]);
  const [cf, setCf] = useState<any>();
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16];
  const [myCrowdfunds, setMyCrowdfunds] = useState<any[]>();
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
  useEffect(() => {
    if (token) {
      getMyCrowdfunds(token)
        .then((getResponse: any) => {
          setMyCrowdfunds(getResponse.data);
        })
        .catch((error) => {
          if (errorStatus.includes(error.response.status)) {
            logout();
          }
        });
      getUnfollowedTopics(token)
        .then((getTopicsResponse: any) => {
          setTopics(getTopicsResponse.data);
        })
        .catch((error) => {
          if (errorStatus.includes(error.response.status)) {
            logout();
          }
        });
      getMyLatestCrowdfunds(token)
        .then((getResponse: any) => {
          setCf(getResponse.data);
        })
        .catch((error) => {
          if (errorStatus.includes(error.response.status)) {
            logout();
          }
        });
      getCrowdfunds(token)
        .then((getResponse: any) => {
          setCfs(getResponse.data);
        })
        .catch((error) => {
          if (errorStatus.includes(error.response.status)) {
            logout();
          }
        });
    }
  }, []);
  return (
    <Fragment>
      <div className="col p-0">
        <ICXGramCard className="root-card-cfhistory">
          <div
            style={{
              width: "95%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "10px",
            }}
          >
            <span className="title-bold-createcf">Crowdfund History</span>
            <div style={{ marginTop: "30px" }}></div>
            <div style={{ overflow: "auto", height: "470px" }}>
              {myCrowdfunds &&
                myCrowdfunds.map((cf) => (
                  <div key={cf._id}>
                    <div
                      style={{
                        marginLeft: "30px",
                        marginRight: "auto",
                        width: "90%",
                        display: "inline-block",
                      }}
                    >
                      <span className="title1-bold-cfhistory">
                        {cf.crowdfundName}
                      </span>
                      <span className="timeago-cfhistory">
                        {Math.floor(
                          (new Date().getTime() - cf.createdAt / 1000) /
                            86400000
                        )}{" "}
                        Days ago
                      </span>
                    </div>
                    <div
                      style={{
                        width: "93%",
                        marginRight: "auto",
                        marginLeft: "auto",
                      }}
                    >
                      <div style={{ marginTop: "10px" }}>
                        <span className="text-cfhistory">
                          <span className="amount-cfhistory">
                            NEAR. {Number(cf.amountRaised).toFixed(2)}
                          </span>{" "}
                          raised out of {cf.targetValue}
                        </span>
                      </div>
                      <div>
                        <progress
                          value={(cf.amountRaised / cf.targetValue) * 100}
                          max="100"
                          style={{
                            height: "30px",
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </ICXGramCard>
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

export default CrowdfundHistory;
