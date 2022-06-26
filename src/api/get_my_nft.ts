import axios from "axios";
import { environment } from "../environment";

const getMyNFT = (postId: any, nearogramToken: any) => {
  return axios.post(
    `${environment.BACKEND_URL}/feed/getMyNft`,
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

export default getMyNFT;
