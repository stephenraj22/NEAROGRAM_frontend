import axios from "axios";
import { environment } from "../environment";

const mintNft = (postId: any, price: any, nearogramToken: any) => {
  return axios.post(
    `${environment.BACKEND_URL}/feed/mint`,
    {
      postId: postId,
      price: price,
    },
    {
      headers: {
        authorization: nearogramToken,
      },
    }
  );
};

export default mintNft;
