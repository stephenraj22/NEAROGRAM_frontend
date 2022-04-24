import React, { Fragment, useState, useEffect, useRef } from "react";
import useAuth from "../../auth/AuthContext";
import "./MyNFTs.scss";
import ICXGramCard from "../../styled-components/ICXGramCard";
import BigText from "../../styled-components/BigText";
import SubText from "../../styled-components/SubText";
import ICXGramSecondaryButton from "../../styled-components/ICXGramSecondaryButton";
import Paragraph from "../../styled-components/Paragraph";
import SVGIcon from "../../styled-components/SVGIcon";
import LikeIcon from "../../assets/icons/like.svg";
import Pencil from "../../assets/icons/pencil.svg";
import getUnfollowedTopics from "../../api/get_unfollowed_topics";
import postTopics from "../../api/set_topics";
import getMyNFTs from "../../api/get_my_nfts";
import MyCrowdfunds from "../my_crowdfunds/MyCrowdfund";
import like from "../../api/like";
import image from "../../assets/imageAssets/45.png";
import { useLocation, useNavigate } from "react-router-dom";
import TopicButton from "../../styled-components/TopicButton";
import InputBox from "../../styled-components/InputBox";

import getMyLatestCrowdfunds from "../../api/get_latest_crowdfund";
function MyNFTs(props: any): JSX.Element {
  const navigate = useNavigate();
  const { state } = useLocation();
  const price = useRef<any>();
  const [token, setToken] = useState(localStorage.getItem("nearogram-token"));
  const [topics, setTopics] = useState<any[]>([]);
  const [feeds, setFeeds] = useState<any[]>([]);
  const [cf, setCf] = useState<any>();
  const [reloadFlag, setReloadFlag] = useState<any>(false);
  const { logout } = useAuth();
  const errorStatus = [401, 403];
  useEffect(() => {
    console.log("liked");
  }, [reloadFlag]);
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
        .then(async (getTopicsResponse: any) => {
          if (state) {
            const nfts = await props.props.near.contract.get_nfts_by_account({
              account: state.accountId,
            });
            console.log("nft1");
            setFeeds(nfts.nfts);
          } else {
            const nfts = await props.props.near.contract.get_nfts_by_account({
              account: props.props.near.wallet.getAccountId(),
            });
            console.log("nft2");
            setFeeds(nfts.nfts);
          }
          setTopics(getTopicsResponse.data);
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
        {feeds &&
          feeds.map((feed: any, idx: number) => (
            <ICXGramCard className="mb-3" style={{ padding: "25px" }} key={idx}>
              <div className="row mx-0 align mb-2">
                <div className="col p-0">
                  <div className="row mx-0 align-items-center">
                    <div className="col-lg-3 col-md-6 p-0">
                      <div id="profileImage">
                        {state == undefined
                          ? makeInitials(props.props.near.wallet.getAccountId())
                          : makeInitials(state.accountId)}
                      </div>
                    </div>
                    <div className="col p-0">
                      <div className="row mx-0">
                        <BigText style={{ fontWeight: "600" }}>
                          {state == undefined
                            ? props.props.near.wallet.getAccountId()
                            : state.accountId}
                        </BigText>
                      </div>
                      <div className="row mx-0">
                        <SubText>Posted in {feed.category}</SubText>
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
              {feed.uri && (
                <div>
                  <img
                    src={feed.uri}
                    width="100%"
                    height="350px"
                    style={{ padding: "5px", marginBottom: "5px" }}
                  ></img>
                </div>
              )}
              <div className="row mx-0 mb-2">
                <Paragraph style={{ marginLeft: "10px" }}>
                  {feed.desc}
                </Paragraph>
              </div>
              {state != undefined ? (
                <div className="row mx-0 justify-content-end align-items-center">
                  <BigText
                    style={{
                      marginRight: "20px",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    {feed.price} NEAR
                  </BigText>

                  <TopicButton
                    className="deposit-withdraw-transact"
                    onClick={() => {
                      props.props.near.contract
                        .make_creator(
                          {
                            index: idx,
                            owner: state.accountId,
                            buyer: props.props.near.wallet.getAccountId(),
                          },
                          "300000000000000"
                        )
                        .then((getResponse: any) => {
                          if (getResponse.status === 200) {
                            navigate("/home/myNFTs");
                          }
                        })
                        .catch((error: any) => {
                          if (errorStatus.includes(error.response.status)) {
                            logout();
                          }
                        });
                    }}
                    disabled={
                      state.accountId == props.props.near.wallet.getAccountId()
                    }
                  >
                    Buy
                  </TopicButton>
                </div>
              ) : (
                <div className="row mx-0 justify-content-end align-items-center">
                  <BigText
                    style={{
                      marginRight: "20px",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    {feed.price} NEAR
                  </BigText>
                  <InputBox
                    placeholder="Enter new price in NEAR"
                    className="amt-input-mint"
                    style={{ marginRight: "20px", width: "200px" }}
                    ref={price}
                  />

                  <TopicButton
                    className="deposit-withdraw-transact"
                    onClick={() => {
                      props.props.near.contract
                        .put_in_sale(
                          {
                            account: props.props.near.wallet.getAccountId(),
                            index: Number(idx),
                            price: Number(price.current.value),
                          },
                          "300000000000000"
                        )
                        .then((getResponse: any) => {
                          if (getResponse.status === 200) {
                            navigate("/home/myNFTs");
                          }
                        })
                        .catch((error: any) => {
                          if (errorStatus.includes(error.response.status)) {
                            logout();
                          }
                        });
                    }}
                    disabled={state != undefined}
                  >
                    Set Price and Sell
                  </TopicButton>
                </div>
              )}
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

export default MyNFTs;
