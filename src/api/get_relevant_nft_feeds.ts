import axios from "axios";
import { environment } from "../environment";

const getRelevantNFTFeeds = (nearogramToken: any) => {
  return axios.get(`${environment.BACKEND_URL}/feed/getRelevantNftFeeds`, {
    headers: {
      authorization: nearogramToken,
    },
  });
};

export default getRelevantNFTFeeds;
