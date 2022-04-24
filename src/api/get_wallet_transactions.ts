import axios from "axios";
import { environment } from "../environment";

const getTransactions = (
  nearogramToken: any,
  forCrowdfundWalletFlag: string
) => {
  return axios.get(`${environment.BACKEND_URL}/transaction/getTransactions`, {
    headers: {
      authorization: nearogramToken,
    },
    params: {
      forCrowdfundWalletFlag: forCrowdfundWalletFlag,
    },
  });
};

export default getTransactions;
