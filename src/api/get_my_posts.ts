import axios from "axios";
import { environment } from "../environment";

const getMyPosts = (nearogramToken: any) => {
  return axios.get(`${environment.BACKEND_URL}/feed/myPosts`, {
    headers: {
      authorization: nearogramToken,
    },
  });
};

export default getMyPosts;
