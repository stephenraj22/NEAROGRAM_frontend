import React, { Fragment, useState, useEffect } from "react";
import useAuth from "../../auth/AuthContext";
import "./ImgNFTFeed.scss";
import ICXGramCard from "../../styled-components/ICXGramCard";
import BigText from "../../styled-components/BigText";
import SubText from "../../styled-components/SubText";
import ICXGramSecondaryButton from "../../styled-components/ICXGramSecondaryButton";
import Paragraph from "../../styled-components/Paragraph";
import SVGIcon from "../../styled-components/SVGIcon";
import LikeIcon from "../../assets/icons/like.svg";
import image from "../../assets/imageAssets/45.png";
import SquaredPlus from "../../assets/icons/squared-plus.svg";
import getUnfollowedTopics from "../../api/get_unfollowed_topics";
import postTopics from "../../api/set_topics";
import getRelevantImgNFTFeeds from "../../api/get_relevant_img_nft_feeds";
import like from "../../api/like";
import MyCrowdfunds from "../my_crowdfunds/MyCrowdfund";
import getMyLatestCrowdfunds from "../../api/get_latest_crowdfund";
import { useLocation, useNavigate } from "react-router-dom";

function ImgNFTFeed(): JSX.Element {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("nearogram-token"));
  const [topics, setTopics] = useState<any[]>([]);
  const [feeds, setFeeds] = useState<any[]>([]);
  const [reloadFlag, setReloadFlag] = useState<any>(false);
  const [cf, setCf] = useState<any>();
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
        .then((getTopicsResponse: any) => {
          setTopics(getTopicsResponse.data);
        })
        .catch((error) => {
          if (errorStatus.includes(error.response.status)) {
            logout();
          }
        });
      getRelevantImgNFTFeeds(token)
        .then((getResponse: any) => {
          setFeeds(getResponse.data);
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
              {feed.imgUri && (
                <div>
                  <img
                    src={feed.imgUri}
                    width="100%"
                    height="350px"
                    style={{ padding: "5px", marginBottom: "5px" }}
                  ></img>
                </div>
              )}
              <div className="row mx-0 mb-2">
                <Paragraph style={{ marginLeft: "10px" }}>
                  {feed.postDescription}
                </Paragraph>
              </div>
              <div className="row mx-0 justify-content-end align-items-center">
                {feed.isMyPost === false && (
                  <div
                    style={{ marginRight: "20px" }}
                    id={String(idx)}
                    onClick={() => {
                      navigate("/home/buyNft", {
                        state: { postId: feed._id },
                      });
                    }}
                  >
                    <span
                      className="row mx-0 align-items-center"
                      style={{ cursor: "pointer" }}
                    >
                      <SVGIcon
                        src={SquaredPlus}
                        width={18}
                        height={18}
                        selected={true}
                      ></SVGIcon>
                    </span>
                  </div>
                )}
                <div
                  id={String(idx)}
                  onClick={() => {
                    if (feeds[Number(idx)]) {
                      const feedsCopy = feeds;
                      feedsCopy[Number(idx)].hasUserLiked =
                        !feeds[Number(idx)].hasUserLiked;
                      if (feeds[Number(idx)].hasUserLiked === true) {
                        feedsCopy[Number(idx)].nLikes =
                          feeds[Number(idx)].nLikes + 1;
                      } else {
                        feedsCopy[Number(idx)].nLikes =
                          feeds[Number(idx)].nLikes - 1;
                      }
                      setFeeds(feedsCopy);
                      setReloadFlag((prev: any) => !prev);
                      like(feeds[Number(idx)]._id, token)
                        .then((getResponse: any) => {
                          console.log("liked");
                        })
                        .catch((error) => {
                          if (errorStatus.includes(error.response.status)) {
                            logout();
                          }
                        });
                    }
                  }}
                >
                  <span
                    className="row mx-0 align-items-center"
                    style={{ cursor: "pointer" }}
                  >
                    <SVGIcon
                      src={LikeIcon}
                      width={18}
                      height={18}
                      selected={feed.hasUserLiked}
                    ></SVGIcon>
                    <span className="ml-1">{feed.nLikes}</span>
                  </span>
                </div>
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

export default ImgNFTFeed;
