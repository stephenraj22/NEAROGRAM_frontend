import axios from "axios";
import { environment } from "../environment";

const getCrowdfunds = (nearogramToken: any) => {
  return axios.get(`${environment.BACKEND_URL}/crowdfund/getCrowdfunds`, {
    headers: {
      authorization: nearogramToken,
    },
  });
};

export default getCrowdfunds;
