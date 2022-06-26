import axios from "axios";
import { environment } from "../environment";

const getUnfollowedTopics = (nearogramToken: any) => {
  return axios.get(`${environment.BACKEND_URL}/topics/getUnfollowedTopics`, {
    headers: {
      authorization: nearogramToken,
    },
  });
};

export default getUnfollowedTopics;
