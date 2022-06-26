import axios from "axios";
import { environment } from "../environment";

const mintImgNft = (
  topicId: any,
  price: any,
  postDescription: any,
  imgUri: any,
  nearogramToken: any
) => {
  return axios.post(
    `${environment.BACKEND_URL}/feed/imgNFTMint`,
    {
      topicId: topicId,
      postDescription: postDescription,
      imgUri: imgUri,
      price: price,
    },
    {
      headers: {
        authorization: nearogramToken,
      },
    }
  );
};

export default mintImgNft;
