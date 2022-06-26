import axios from "axios";
import { environment } from "../environment";

const setPriceImgNft = (postId: any, price: any, nearogramToken: any) => {
  return axios.post(
    `${environment.BACKEND_URL}/feed/imgNFTSetPrice`,
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

export default setPriceImgNft;
