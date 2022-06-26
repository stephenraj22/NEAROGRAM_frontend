import React, { useEffect, Fragment, useState, useRef } from "react";
import "./NewCrowdfund.scss";
import ICXGramCard from "../../styled-components/ICXGramCard";
import InputBox from "../../styled-components/InputBox";
import TopicButton from "../../styled-components/TopicButton";
import InputArea from "../../styled-components/InputArea";
import useAuth from "../../auth/AuthContext";
import ICXGramSecondaryButton from "../../styled-components/ICXGramSecondaryButton";
import SubText from "../../styled-components/SubText";
import BigText from "../../styled-components/BigText";
import MyCrowdfunds from "../my_crowdfunds/MyCrowdfund";

import getUnfollowedTopics from "../../api/get_unfollowed_topics";
import postTopics from "../../api/set_topics";
import { Route, useNavigate } from "react-router-dom";
import * as buffer from "buffer";
(window as any).Buffer = buffer.Buffer;
function NewCrowdfund(props: any): JSX.Element {
  console.log(props.props.near.wallet.getAccountId());
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [err, setErr] = useState<any>();
  const [token, setToken] = useState(localStorage.getItem("nearogram-token"));
  const [topics, setTopics] = useState<any[]>([]);
  const [cfs, setCfs] = useState<any[]>([]);
  const [cf, setCf] = useState<any>();
  const name = useRef<any>(null);
  const targetAmount = useRef<any>(null);
  const deadline = useRef<any>(null);
  const minAmount = useRef<any>(null);
  const desc = useRef<any>(null);
  const errorStatus = [401, 403];
  const [btnFlag, setBtnFlag] = useState<any>(false);
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
  const createCf = async () => {
    if (
      name.current.value &&
      targetAmount.current.value &&
      new Date(deadline.current.value).getTime() * 1000 >
        new Date().getTime() * 1000 &&
      minAmount.current.value &&
      desc.current.value &&
      Number(minAmount.current.value) > 0 &&
      Number(targetAmount.current.value) > 0 &&
      token
    ) {
      setBtnFlag(true);
      props.props.near.contract1
        .create_cf(
          {
            account_id: props.props.near.wallet.getAccountId(),
            cf_name: name.current.value,
            cf_desc: desc.current.value,
            deadline: new Date(deadline.current.value).getTime() * 1000,
            created_at: new Date().getTime() * 1000,
            target_value: Number(targetAmount.current.value),
            min_amount: Number(minAmount.current.value),
          },
          "300000000000000"
        )
        .then((res: any) => {
          console.log(res);
          navigate("/home/crowdfunding");
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      setErr("All fields are required!");
    }
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
    }
  }, []);
  return (
    <Fragment>
      <div className="col-md-6">
        <ICXGramCard className="root-card-createcf">
          <div style={{ textAlign: "center", marginTop: "25px" }}>
            <span className="title-bold-createcf">Create Crowdfund</span>
            <div style={{ height: "20px" }} className="err-createcf">
              {err}
            </div>
            <InputBox
              placeholder="Name"
              className="input-createcf"
              style={{ marginTop: "20px" }}
              ref={name}
            />
            <InputBox
              placeholder="Target amount"
              className="input-createcf"
              ref={targetAmount}
            />
            <InputBox
              placeholder="Deadline"
              type="date"
              className="input-createcfdate"
              ref={deadline}
            />
            <InputBox
              placeholder="Minimum amount"
              className="input-createcf"
              ref={minAmount}
            />
            <InputArea
              placeholder="Description"
              className="input-createcf"
              style={{ height: "80px" }}
              ref={desc}
            />
            <TopicButton
              className="create-button-createcf"
              id="load1"
              onClick={createCf}
              disabled={btnFlag}
            >
              Create
            </TopicButton>
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

export default NewCrowdfund;
