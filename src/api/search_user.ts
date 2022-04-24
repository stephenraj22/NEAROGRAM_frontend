import axios from "axios";
import { environment } from "../environment";

const getCrowdfunds = (nearogramToken: any, searchParam: any) => {
  return axios.post(
    `${environment.BACKEND_URL}/accounts/search`,
    {
      searchParam: searchParam,
    },
    {
      headers: {
        authorization: nearogramToken,
      },
    }
  );
};

export default getCrowdfunds;
