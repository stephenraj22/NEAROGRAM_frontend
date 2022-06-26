import React, { Fragment, useState, useEffect, useRef } from "react";
import useAuth from "../../auth/AuthContext";
import "./MintNFT.scss";
import ICXGramCard from "../../styled-components/ICXGramCard";
import BigText from "../../styled-components/BigText";
import SubText from "../../styled-components/SubText";
import ICXGramSecondaryButton from "../../styled-components/ICXGramSecondaryButton";
import Paragraph from "../../styled-components/Paragraph";
import getUnfollowedTopics from "../../api/get_unfollowed_topics";
import postTopics from "../../api/set_topics";
import getMyPost from "../../api/get_my_post";
import MyCrowdfunds from "../my_crowdfunds/MyCrowdfund";
import TopicButton from "../../styled-components/TopicButton";
import InputBox from "../../styled-components/InputBox";
import mintNft from "../../api/mint_nft";
import { useLocation, useNavigate } from "react-router-dom";
import getMyLatestCrowdfunds from "../../api/get_latest_crowdfund";
function MintNFT(): JSX.Element {
  const { state } = useLocation();
  const [token, setToken] = useState(localStorage.getItem("nearogram-token"));
  const [topics, setTopics] = useState<any[]>([]);
  const [feed, setFeed] = useState<any>();
  const [cf, setCf] = useState<any>();
  const { logout } = useAuth();
  const price = useRef<any>();
  const errorStatus = [401, 403];
  const navigate = useNavigate();
  const [btnFlag, setBtnFlag] = useState<any>(false);

  const timesAgo = (current: any, previous: any) => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;
    const elapsed = current - previous;
    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + "s ago";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + "m ago";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + "h ago";
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + "d ago";
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + "mon ago";
    }
  };
  const mint = () => {
    if (Number(price.current.value) > 0 && token) {
      setBtnFlag(true);
      mintNft(feed.postId, price.current.value, token)
        .then((getResponse: any) => {
          if (getResponse.data.txId != null) {
            navigate("/home/NFTFeed");
          }
        })
        .catch((error) => {
          setBtnFlag(false);
          if (errorStatus.includes(error.response.status)) {
            logout();
          }
        });
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
      getUnfollowedTopics(token)
        .then((getTopicsResponse: any) => {
          setTopics(getTopicsResponse.data);
        })
        .catch((error) => {
          if (errorStatus.includes(error.response.status)) {
            logout();
          }
        });
      if (state) {
        getMyPost(state.postId, token)
          .then((getResponse: any) => {
            setFeed(getResponse.data);
          })
          .catch((error) => {
            if (errorStatus.includes(error.response.status)) {
              logout();
            }
          });
      }
      getMyLatestCrowdfunds(token)
        .then((getResponse: any) => {
          setCf(getResponse.data);
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
      <div className="col-md-6" style={{ overflow: "auto", height: "600px" }}>
        {feed && (
          <ICXGramCard className="mb-3" style={{ padding: "25px" }}>
            <div className="row mx-0 align mb-2">
              <div className="col p-0">
                <div className="row mx-0 align-items-center">
                  <div className="col-lg-3 col-md-6 p-0">
                    <div id="profileImage">
                      {makeInitials(feed.accountId.userName)}
                    </div>
                  </div>
                  <div className="col p-0">
                    <div className="row mx-0">
                      <BigText style={{ fontWeight: "600" }}>
                        {feed.accountId.userName}
                      </BigText>
                    </div>
                    <div className="row mx-0">
                      <SubText>Posted in {feed.topicId.topicName}</SubText>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col p-0 text-right">
                <SubText style={{ fontWeight: "600" }}>
                  {timesAgo(
                    Number(new Date().getTime()),
                    Number(feed.createdAt / 1000)
                  )}
                </SubText>
              </div>
            </div>
            <div className="row mx-0 mb-2">
              <Paragraph>{feed.postDescription}</Paragraph>
            </div>
            <div className="row mx-0 justify-content-end align-items-center">
              <InputBox
                placeholder="Enter the price in NEAR"
                className="amt-input-mint"
                style={{ marginRight: "20px", width: "200px" }}
                ref={price}
              />

              <TopicButton
                className="deposit-withdraw-transact"
                onClick={mint}
                disabled={btnFlag}
              >
                Mint
              </TopicButton>
            </div>
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
        {cf && <MyCrowdfunds cf={cf} />}
      </div>
    </Fragment>
  );
}

export default MintNFT;
