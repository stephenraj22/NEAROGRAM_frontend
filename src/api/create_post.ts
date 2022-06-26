import axios from "axios";
import { environment } from "../environment";

const createPost = (postDesc: any, topicId: any, nearogramToken: any) => {
  return axios.post(
    `${environment.BACKEND_URL}/feed/createPost`,
    {
      postDescription: postDesc,
      topicId: topicId,
    },
    {
      headers: {
        authorization: nearogramToken,
      },
    }
  );
};

export default createPost;
