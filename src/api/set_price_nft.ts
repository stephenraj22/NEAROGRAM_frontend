import axios from "axios";
import { environment } from "../environment";

const setPrice = (postId: any, price: any, nearogramToken: any) => {
  return axios.post(
    `${environment.BACKEND_URL}/feed/setPrice`,
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

export default setPrice;
