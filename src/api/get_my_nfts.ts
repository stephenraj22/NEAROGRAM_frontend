import axios from "axios";
import { environment } from "../environment";

const getMyNFTs = (nearogramToken: any) => {
  return axios.get(`${environment.BACKEND_URL}/feed/myNFTs`, {
    headers: {
      authorization: nearogramToken,
    },
  });
};

export default getMyNFTs;
