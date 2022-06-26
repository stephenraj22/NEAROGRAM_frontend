import axios from "axios";
import { environment } from "../environment";

const buyNft = (postId: any, nearogramToken: any) => {
  return axios.post(
    `${environment.BACKEND_URL}/feed/buy`,
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

export default buyNft;
