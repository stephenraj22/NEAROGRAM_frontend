import React, { useEffect, useState } from "react";
import ICXGramButton from "../../styled-components/ICXGramButton";
import "./SignIn.scss";
import useAuth from "../../auth/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

import Near from "../../assets/icons/near.svg";
import signIn from "../../api/auth_service";

function SignIn(props: any): JSX.Element {
  console.log(props);
  const { login, authenticated } = useAuth();
  const [user, setUser] = useState<any>(props.near.near.currentUser);
  const navigate = useNavigate();
  const signInWallet = () => {
    props.near.near.wallet.requestSignIn(
      {
        contractId: "crowdfund.stephenraj88.testnet",
        methodNames: [
          "get_cf",
          "get_active_cfs",
          "create_cf",
          "contribute",
          "withdraw",
        ],
      },
      "NEAROGRAM",
      null,
      null
    );
  };

  useEffect(() => {
    if (user) {
      signIn(user)
        .then((signInResponse: any) => {
          console.log(signInResponse);

          login(signInResponse.data.token);
          if (signInResponse.data.flag) {
            navigate("/topics");
          } else {
            navigate("/home/feed");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("ste");
    }
  }, [user]);

  return (
    <div>
      <div
        className="container-fluid align-items-center"
        id="signInPageContainer"
      >
        <div className="row mx-0 title">
          <span className="title-bold">NEAR</span>OGRAM
        </div>
        <div className="row mx-0 mt-4">
          <ICXGramButton className="sign-in-button px-3" onClick={signInWallet}>
            <img
              className="mr-2"
              src={Near}
              style={{ color: "white" }}
              width={30}
              height={30}
            />
            Sign in with NEAR
          </ICXGramButton>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
