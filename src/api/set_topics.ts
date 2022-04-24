import axios from "axios";
import { environment } from "../environment";

const postTopics = (topics: any, nearogramToken: any) => {
  return axios.post(
    `${environment.BACKEND_URL}/topics/setTopics`,
    {
      topics: topics,
    },
    {
      headers: {
        authorization: nearogramToken,
      },
    }
  );
};

export default postTopics;
