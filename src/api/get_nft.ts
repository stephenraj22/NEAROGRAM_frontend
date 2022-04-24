import axios from "axios";
import { environment } from "../environment";

const getNft = (postId: any, nearogramToken: any) => {
  return axios.post(
    `${environment.BACKEND_URL}/feed/getNft`,
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

export default getNft;
