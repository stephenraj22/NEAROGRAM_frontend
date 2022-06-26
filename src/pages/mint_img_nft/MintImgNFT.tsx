import React, { useEffect, Fragment, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MintImgNFT.scss";
import ICXGramCard from "../../styled-components/ICXGramCard";
import InputBox from "../../styled-components/InputBox";
import TopicButton from "../../styled-components/TopicButton";
import InputArea from "../../styled-components/InputArea";
import getTopics from "../../api/get_topics";
import useAuth from "../../auth/AuthContext";
import cross from "../../assets/icons/cross.svg";
import cancel from "../../assets/icons/cancel.svg";
import mintImgNft from "../../api/mint_img_nft";
import ICXGramSecondaryButton from "../../styled-components/ICXGramSecondaryButton";
import SubText from "../../styled-components/SubText";
import BigText from "../../styled-components/BigText";
import MyCrowdfunds from "../my_crowdfunds/MyCrowdfund";
import getCrowdfunds from "../../api/get_crowd_funds";
import getMyLatestCrowdfunds from "../../api/get_latest_crowdfund";
import getUnfollowedTopics from "../../api/get_unfollowed_topics";
import postTopics from "../../api/set_topics";
import { FileUploader } from "react-drag-drop-files";
import { create } from "ipfs-http-client";
const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];
const ipfsURL = { url: "https://ipfs.infura.io:5001/api/v0" };
const client = create(ipfsURL);

function MintImgNFT(props: any): JSX.Element {
  console.log(props);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<any[]>([]);
  const [unfollowedTopics, setUnfollowedTopics] = useState<any[]>([]);
  const [cfs, setCfs] = useState<any[]>([]);
  const [cf, setCf] = useState<any>();
  const [selectedTopic, setSelectedTopic] = useState<any>("");
  const [selectedId, setSelectedId] = useState<any>("");
  const [imgUri, setImgUri] = useState<any>("");
  const postDescription = useRef<any>(null);
  const price = useRef<any>(null);
  const [flag, setFlag] = useState<any>(false);
  const [btnFlag, setBtnFlag] = useState<any>(false);
  const [token, setToken] = useState(localStorage.getItem("nearogram-token"));
  const [suggestedTopics, setSuggestedTopics] = useState<any[]>([]);
  const [err, setErr] = useState<any>("");
  const [file, setFile] = useState<any>(null);
  const handleChange = (file: any) => {
    setFile(file);
  };
  const removeImage = () => {
    setFile(null);
  };
  const follow = (event: any) => {
    postTopics([event.target.id], token)
      .then((setTopicsResponse: any) => {
        if (setTopicsResponse.status === 200) {
          getUnfollowedTopics(token)
            .then((getTopicsResponse: any) => {
              setUnfollowedTopics(getTopicsResponse.data);
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
  const submitPost = async () => {
    try {
      if (
        postDescription.current.value &&
        selectedId &&
        Number(price.current.value) > 0 &&
        file
      ) {
        setBtnFlag(true);
        const added = await client.add(file);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        url &&
          props.props.near.contract
            .mint(
              {
                account: props.props.near.currentUser.accountId,
                uri: url,
                category: selectedTopic,
                desc: postDescription.current.value,
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
              setBtnFlag(false);
              if (errorStatus.includes(error.response.status)) {
                logout();
              } else {
                setErr(error.response.data.status);
              }
            });
      } else {
        setErr("All parameters are required!");
      }
    } catch (error) {
      setErr("Error uploading file");
      setBtnFlag(false);
    }
  };
  const filterTopics = (event: any) => {
    if (event.target.value !== "") {
      setSuggestedTopics(
        topics
          .filter((item) => item.topicName.includes(event.target.value))
          .slice(0, 1)
      );
    } else {
      setSuggestedTopics([]);
    }
  };
  const setName = (event: any) => {
    setSelectedId(event?.target.id);
    setSelectedTopic(event.target.value);
    setFlag(true);
  };
  const revert = () => {
    setSelectedId("");
    setSelectedTopic("");
    setFlag(false);
  };
  const errorStatus = [401, 403];
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
      getUnfollowedTopics(token)
        .then((getTopicsResponse: any) => {
          setUnfollowedTopics(getTopicsResponse.data);
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
      <div className="col-md-6">
        <ICXGramCard className="root-card-createpost">
          <div style={{ textAlign: "center", marginTop: "25px" }}>
            <span className="title-bold-createcf">Mint Image</span>
            <div style={{ height: "20px" }} className="err-createpost">
              {err}
            </div>
            {file == null && (
              <div
                style={{ marginLeft: "30px", marginTop: "20px", width: "80%" }}
              >
                <FileUploader
                  handleChange={handleChange}
                  name="file"
                  types={fileTypes}
                  label="Drag and Drop file here"
                />
              </div>
            )}
            {file && (
              <div className="img-container-createimgnft">
                <img
                  className="close-createimgnft"
                  src={cancel}
                  width="15px"
                  onClick={removeImage}
                />
                <div
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "220px",
                    height: "100px",
                  }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    width="220px"
                    height="100px"
                  ></img>
                </div>
              </div>
            )}
            <InputArea
              placeholder="Description"
              className="input-createcf"
              style={{ height: "80px" }}
              ref={postDescription}
            />
            <InputBox
              placeholder="Enter price in NEAR"
              className="input-createcf"
              style={{ marginTop: "10px" }}
              ref={price}
            />
            <div className={!flag ? "hide-createPost" : "show-createPost"}>
              <span className="topic-createPost">
                {selectedTopic}
                <span style={{ marginLeft: "10px" }}>
                  <img
                    className="mr-2"
                    src={cross}
                    style={{ backgroundColor: "transparent" }}
                    width={20}
                    height={20}
                    onClick={revert}
                  />
                </span>
              </span>
            </div>
            <div className={flag ? "hide-createPost" : "show-createPost"}>
              <InputBox
                placeholder="Topic to post"
                className="input-createcf"
                style={{ marginTop: "10px" }}
                onKeyUp={filterTopics}
              />
              {suggestedTopics &&
                suggestedTopics.map((topic: any) => (
                  <option
                    key={topic._id}
                    id={topic._id}
                    onClick={setName}
                    className="select-createimgnft"
                  >
                    {topic.topicName}
                  </option>
                ))}
            </div>
            <TopicButton
              className="create-button-createimgnft"
              onClick={submitPost}
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
          {unfollowedTopics &&
            unfollowedTopics.map((topic: any, index: number) => (
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

export default MintImgNFT;
