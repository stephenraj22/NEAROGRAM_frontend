import axios from "axios";
import { environment } from "../environment";

const getRelevantFeeds = (nearogramToken: any) => {
  return axios.get(`${environment.BACKEND_URL}/feed/getRelevantFeeds`, {
    headers: {
      authorization: nearogramToken,
    },
  });
};

export default getRelevantFeeds;
