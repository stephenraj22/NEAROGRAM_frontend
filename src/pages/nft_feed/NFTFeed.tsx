import React, { Fragment, useState, useEffect } from "react";
import useAuth from "../../auth/AuthContext";
import "./NFTFeed.scss";
import ICXGramCard from "../../styled-components/ICXGramCard";
import BigText from "../../styled-components/BigText";
import SubText from "../../styled-components/SubText";
import ICXGramSecondaryButton from "../../styled-components/ICXGramSecondaryButton";
import Paragraph from "../../styled-components/Paragraph";
import SVGIcon from "../../styled-components/SVGIcon";
import LikeIcon from "../../assets/icons/like.svg";
import SquaredPlus from "../../assets/icons/squared-plus.svg";
import getUnfollowedTopics from "../../api/get_unfollowed_topics";
import postTopics from "../../api/set_topics";
import getRelevantNFTFeeds from "../../api/get_relevant_nft_feeds";
import like from "../../api/like";
import MyCrowdfunds from "../my_crowdfunds/MyCrowdfund";
import getMyLatestCrowdfunds from "../../api/get_latest_crowdfund";
import { useLocation, useNavigate } from "react-router-dom";
import TopicButton from "../../styled-components/TopicButton";
import { Console } from "console";

function NFTFeed(props: any): JSX.Element {
  console.log(props);
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
        .then(async (getTopicsResponse: any) => {
          const creators = await props.props.near.contract.get_creators();
          setFeeds(creators);
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
        {feeds &&
          feeds.map((feed: any, idx: number) => (
            <ICXGramCard className="mb-3" style={{ padding: "25px" }} key={idx}>
              <div className="row mx-0 align mb-2">
                <div className="col p-0">
                  <div className="row mx-0 align-items-center">
                    <div className="col-lg-3 col-md-6 p-0">
                      <div id="profileImage">{makeInitials(feed)}</div>
                    </div>
                    <div className="col p-0">
                      <div className="row mx-0">
                        <BigText style={{ fontWeight: "600" }}>{feed}</BigText>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: "600", marginTop: "20px" }}>
                  <TopicButton
                    className="deposit-withdraw-transact"
                    onClick={() =>
                      navigate("/home/myNFTs", {
                        state: { accountId: feed },
                      })
                    }
                  >
                    View{" "}
                  </TopicButton>
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

export default NFTFeed;
