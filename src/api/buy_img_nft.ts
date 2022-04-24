import axios from "axios";
import { environment } from "../environment";

const buyImgNft = (postId: any, nearogramToken: any) => {
  return axios.post(
    `${environment.BACKEND_URL}/feed/buyImgNFT`,
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

export default buyImgNft;
