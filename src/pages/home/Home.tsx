import React, { useState, useRef, useEffect } from "react";
import PageContainer from "../../styled-components/PageContainer";
import FeedHeader from "../feed/components/FeedHeader";
import "./Home.scss";
import useAuth from "../../auth/AuthContext";
import { Route, useNavigate } from "react-router-dom";
import Feed from "../feed/Feed";
import ICXGramCard from "../../styled-components/ICXGramCard";
import styled, { DefaultTheme } from "styled-components";
import myposts from "../../assets/icons/myposts.svg";
import InactiveCfs from "../../assets/icons/nfts.svg";
import pencil from "../../assets/icons/pencil.svg";
import mynfts from "../../assets/icons/mynfts.svg";
import newcf from "../../assets/icons/newcf.svg";
import HomeIcon from "../../assets/icons/home.svg";
import CrowdfundingIcon from "../../assets/icons/crowdfunding.svg";
import TransactIcon from "../../assets/icons/transact.svg";
import WalletIcon from "../../assets/icons/wallet.svg";
import ImageNFTs from "../../assets/icons/imgnftfeed.svg";
import LogoutIcon from "../../assets/icons/logout.svg";
import CreateImageNFTs from "../../assets/icons/createimgnft.svg";
import List from "../../assets/icons/list.svg";
import Wallet from "../wallet/Wallet";
import SVGIcon from "../../styled-components/SVGIcon";
import Transact from "../transact/Transact";
import CrowdfundFeed from "../crowdfund_feed/CrowdfundFeed";
import MyPosts from "../my_posts/MyPosts";
import InputBox from "../../styled-components/InputBox";
import searchUser from "../../api/search_user";
import MyNFTs from "../my_nfts/MyNFTs";
import NewPost from "../new_post/NewPost";
import NewCrowdfund from "../new_crowdfund/NewCrowdfund";
import NFTFeed from "../nft_feed/NFTFeed";
import CrowdfundHistory from "../crowdfund_history/CrowdfundHistory";
import CrowdfundDescription from "../crowdfund_description/CrowdfundDescription";
import BuyNFT from "../buy_nft/BuyNFT";
import MintNFT from "../mint_nft/MintNFT";
import SellNFT from "../sell_nft/SellNFT";
import MintImgNFT from "../mint_img_nft/MintImgNFT";
import BuyImgNFT from "../buy_img_nft/BuyImgNFT";
import InactiveCrowdfundingFeed from "../inactive_crowdfund_feed/InactiveCrowdfundFeed";
import MyCrowdfunds from "../my_crowdfunds/MyCrowdfund";

interface MenuRowProps {
  theme: DefaultTheme;
  selected: boolean;
  fill?: string;
  onClick: any;
}

interface SubRoute {
  name: string;
}

const MenuRow = styled.div<MenuRowProps>`
  border-width: 2px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.lightDark};
  color: ${(props: MenuRowProps) =>
    props.selected
      ? props.theme.colors.primary
      : props.theme.colors.lightTextColor};
  &:hover {
    cursor: pointer;
  }
`;

const SUBROUTES: SubRoute[] = [
  { name: "feed" },
  { name: "transact" },
  { name: "wallet" },
  { name: "myNFTs" },
  { name: "NFTFeed" },
];

function Home({ subRouteFromRouter, walletCon }: any): JSX.Element {
  console.log(subRouteFromRouter, walletCon);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("nearogram-token"));
  const searchParam = useRef<any>();
  const [searchResult, setSearchResult] = useState<any>(null);
  const errorStatus = [401, 403];
  const [walletId, setWalletId] = useState<any>(null);
  const signOutFromWallet = async () => {
    await walletCon.near.wallet.signOut();
    logout();
  };
  const navigateToRoute = (subRoute: string) => {
    navigate(`/home/${subRoute}`);
  };
  const navigateToCreatePost = () => {
    navigate(`/home/newPost`);
  };
  const searchEmail = () => {
    if (searchParam.current.value.length > 3) {
      searchUser(token, searchParam.current.value)
        .then((getResponse: any) => {
          setSearchResult(getResponse.data);
        })
        .catch((error) => {
          if (errorStatus.includes(error.response.status)) {
            logout();
          }
        });
    } else {
      setSearchResult(null);
    }
  };
  const setUserDetails = () => {
    setWalletId(searchResult.walletId);
    setSearchResult(null);
    searchParam.current.value = "";
  };
  useEffect(() => {
    return;
  }, [walletId]);
  return (
    <PageContainer>
      <FeedHeader>
        <span className="title">
          <span className="title-bold">NEAR</span>GRAM
        </span>
        <div>
          <InputBox
            placeholder="Search email"
            className="align-items-center"
            style={{ width: "650px" }}
            ref={searchParam}
            onKeyUp={searchEmail}
          />
          {searchResult !== null && (
            <ICXGramCard style={{ width: "600px" }} onClick={setUserDetails}>
              <div>
                <span>NEARGRAM WalletID:</span>
                <span style={{ color: "#656D72" }}>
                  {searchResult.walletId}
                </span>
              </div>
            </ICXGramCard>
          )}
        </div>
        <div className="align-items-left">
          <SVGIcon
            src={pencil}
            selected={true}
            onClick={navigateToCreatePost}
            width={20}
            height={20}
            style={{
              marginTop: "5px",
              marginLeft: "20px",
            }}
          ></SVGIcon>
          <SVGIcon
            src={CreateImageNFTs}
            selected={true}
            onClick={() => {
              navigate(`/home/CreateImageNFT`);
            }}
            width={20}
            height={20}
            style={{
              marginTop: "5px",
              marginLeft: "20px",
            }}
          ></SVGIcon>
          <SVGIcon
            src={mynfts}
            selected={true}
            onClick={() => {
              navigate(`/home/myPosts`);
            }}
            width={20}
            height={20}
            style={{
              marginTop: "5px",
              marginLeft: "20px",
            }}
          ></SVGIcon>
          <SVGIcon
            src={myposts}
            selected={true}
            onClick={() => {
              navigate(`/home/myNFTs`);
            }}
            width={20}
            height={20}
            style={{
              marginTop: "5px",
              marginLeft: "20px",
            }}
          ></SVGIcon>
          <SVGIcon
            src={newcf}
            selected={true}
            onClick={() => {
              navigate(`/home/newCrowdfund`);
            }}
            width={20}
            height={20}
            style={{
              marginTop: "5px",
              marginLeft: "20px",
            }}
          ></SVGIcon>
          <SVGIcon
            src={LogoutIcon}
            selected={true}
            onClick={signOutFromWallet}
            width={20}
            height={20}
            style={{
              marginTop: "5px",
              marginLeft: "20px",
            }}
          ></SVGIcon>
        </div>
      </FeedHeader>

      <div className="row mx-0">
        <div className="col-md-3 col-sm-2 p-0">
          <ICXGramCard className="sidenav pl-0 py-3">
            {SUBROUTES.map((subRoute: SubRoute, index: number) => (
              <MenuRow
                className="row mx-0 my-3 pl-4 align-items-center"
                selected={subRouteFromRouter === subRoute.name}
                key={index}
                onClick={() => {
                  navigateToRoute(subRoute.name);
                }}
              >
                <SVGIcon
                  className="mr-2"
                  src={getSubComponentIconToRender(subRoute.name)}
                  width={25}
                  height={25}
                  selected={subRouteFromRouter === subRoute.name}
                ></SVGIcon>
                {subRoute.name.charAt(0).toUpperCase() +
                  subRoute.name.substring(1)}
              </MenuRow>
            ))}
          </ICXGramCard>
        </div>

        {getSubComponentToRender(subRouteFromRouter, walletId, walletCon)}
      </div>
    </PageContainer>
  );
}

const getSubComponentToRender = (
  subRoute: string,
  walletId: string,
  props: any
) => {
  switch (subRoute) {
    case "feed":
      return <Feed />;
    case "wallet":
      return <Wallet props={props} />;
    case "transact":
      return <Transact walletCon={props} />;
    case "crowdfunding":
      return <CrowdfundFeed props={props} />;
    case "myposts":
      return <MyPosts />;
    case "mynfts":
      return <MyNFTs props={props} />;
    case "newpost":
      return <NewPost />;
    case "newcf":
      return <NewCrowdfund props={props} />;
    case "NFTFeed":
      return <NFTFeed props={props} />;
    case "cfhistory":
      return <CrowdfundHistory />;
    case "cfdesc":
      return <CrowdfundDescription props={props} />;
    case "buynft":
      return <BuyNFT />;
    case "mintnft":
      return <MintNFT />;
    case "sellnft":
      return <SellNFT />;
    case "InactiveCF":
      return <InactiveCrowdfundingFeed props={props} />;
    case "MyCFs":
      return <MyCrowdfunds props={props} />;
    case "createimgnft":
      console.log(props);
      return <MintImgNFT props={props} />;
    case "buyimgnft":
      return <BuyImgNFT />;
    default:
      return <Feed />;
  }
};

const getSubComponentIconToRender = (subRoute: string) => {
  switch (subRoute) {
    case "feed":
      return HomeIcon;
    case "transact":
      return TransactIcon;
    case "wallet":
      return WalletIcon;
    case "myNFTs":
      return List;
    case "NFTFeed":
      return ImageNFTs;
  }
};

export default Home;
