import axios from "axios";
import { environment } from "../environment";

const getTopics = (nearogramToken: any) => {
  return axios.get(`${environment.BACKEND_URL}/topics/getTopics`, {
    headers: {
      authorization: nearogramToken,
    },
  });
};

export default getTopics;
