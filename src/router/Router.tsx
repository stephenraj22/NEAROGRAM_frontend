import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "../auth/AuthContext";
import Home from "../pages/home/Home";
import SignIn from "../pages/signin/SignIn";
import Topics from "../pages/topics/Topics";
import AuthRouteGuard from "../auth/AuthRouteGuard";

function Router(props: any) {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<SignIn near={props} />} />
          <Route
            path="/home/feed"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="feed" walletCon={props} />
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/wallet"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="wallet" walletCon={props} />
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/crowdfunding"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="crowdfunding" walletCon={props} />{" "}
              </AuthRouteGuard>
            }
          />
          <Route
            path="/topics"
            element={
              <AuthRouteGuard>
                <Topics />
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/myPosts"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="myposts" />{" "}
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/myNFTs"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="mynfts" walletCon={props} />{" "}
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/newPost"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="newpost" />{" "}
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/newCrowdfund"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="newcf" walletCon={props} />{" "}
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/NFTFeed"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="NFTFeed" walletCon={props} />{" "}
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/crowdfundHistory"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="cfhistory" />{" "}
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/crowdfundDescription"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="cfdesc" walletCon={props} />{" "}
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/MyCFs"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="MyCFs" walletCon={props} />{" "}
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/buyNft"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="buynft" />{" "}
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/mint"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="mintnft" />{" "}
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/sellNft"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="sellnft" />
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/transact"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="transact" walletCon={props} />
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/InactiveCF"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="InactiveCF" walletCon={props} />
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/CreateImageNFT"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="createimgnft" walletCon={props} />
              </AuthRouteGuard>
            }
          />
          <Route
            path="/home/buyImgNFT"
            element={
              <AuthRouteGuard>
                <Home subRouteFromRouter="buyimgnft" />
              </AuthRouteGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default Router;
