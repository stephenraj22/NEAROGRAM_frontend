import React, { useEffect, useState } from "react";
import "./Topics.scss";
import useAuth from "../../auth/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import TopicButton from "../../styled-components/TopicButton";
import ICXGramButton from "../../styled-components/ICXGramButton";
import postTopics from "../../api/set_topics";
import getTopics from "../../api/get_topics";

function Topics(): JSX.Element {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<any[]>([]);
  const [token, setToken] = useState(localStorage.getItem("nearogram-token"));
  const errorStatus = [401, 403];
  const callPostTopics = () => {
    if (selectedTopics.length !== 0) {
      postTopics(selectedTopics, token)
        .then((setTopicsResponse: any) => {
          if (setTopicsResponse.status === 200) {
            navigate("/home/feed");
          }
        })
        .catch((error) => {
          if (errorStatus.includes(error.response.status)) {
            logout();
          }
        });
    }
  };
  const addOrRemove = async (event: any) => {
    if (selectedTopics.includes(event.target.id)) {
      await setSelectedTopics(
        selectedTopics.filter((item) => item !== event.target.id)
      );
    } else {
      await setSelectedTopics([...selectedTopics, event.target.id]);
    }
  };
  useEffect(() => {
    if (token) {
      getTopics(token)
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
    <div>
      <div className="parent-div container">
        <h1 className="title-bold row">Topics</h1>
        <p className="description row">
          Let us know you better, select atleast 3 topics
        </p>
        <div className="row">
          {topics &&
            topics.map((item) => (
              <div className="button-div" key={item._id}>
                <TopicButton
                  key={item._id}
                  id={item._id}
                  className={
                    selectedTopics.indexOf(item._id) !== -1
                      ? "selected"
                      : "not-selected"
                  }
                  onClick={addOrRemove}
                >
                  {item.topicName}
                </TopicButton>
              </div>
            ))}
        </div>
        <div className="button-div-start row">
          <ICXGramButton
            className="selected"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "10px",
            }}
            onClick={callPostTopics}
          >
            Get Started
          </ICXGramButton>
        </div>
      </div>
    </div>
  );
}
export default Topics;
