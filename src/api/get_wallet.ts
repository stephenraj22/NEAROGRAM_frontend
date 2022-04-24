import axios from "axios";
import { environment } from "../environment";

const getWallets = (nearogramToken: any) => {
  return axios.get(`${environment.BACKEND_URL}/wallet/getWalletDetails`, {
    headers: {
      authorization: nearogramToken,
    },
  });
};

export default getWallets;
