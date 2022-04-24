import axios from "axios";
import { environment } from "../environment";

const getMyLatestCrowdfunds = (nearogramToken: any) => {
  return axios.get(
    `${environment.BACKEND_URL}/crowdfund/getMyLatestCrowdfund`,
    {
      headers: {
        authorization: nearogramToken,
      },
    }
  );
};

export default getMyLatestCrowdfunds;
