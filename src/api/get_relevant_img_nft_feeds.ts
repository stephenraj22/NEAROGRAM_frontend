import axios from "axios";
import { environment } from "../environment";

const getRelevantImgNFTFeeds = (nearogramToken: any) => {
  return axios.get(`${environment.BACKEND_URL}/feed/getRelevantImgNftFeeds`, {
    headers: {
      authorization: nearogramToken,
    },
  });
};

export default getRelevantImgNFTFeeds;
