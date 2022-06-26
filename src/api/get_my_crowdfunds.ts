import axios from "axios";
import { environment } from "../environment";

const getMyCrowdfunds = (nearogramToken: any) => {
  return axios.get(`${environment.BACKEND_URL}/crowdfund/getMyCrowdfunds`, {
    headers: {
      authorization: nearogramToken,
    },
  });
};

export default getMyCrowdfunds;
