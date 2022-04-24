import axios from "axios";
import { environment } from "../environment";

const like = (postId: any, nearogramToken: any) => {
  return axios.post(
    `${environment.BACKEND_URL}/feed/likePost`,
    {
      postId: postId,
    },
    {
      headers: {
        authorization: nearogramToken,
      },
    }
  );
};

export default like;
