import axios from "axios";
import { environment } from "../environment";

const getCfTransactions = (nearogramToken: any, cfId: any) => {
  return axios.get(
    `${environment.BACKEND_URL}/transaction/getCrowdfundTransactions`,
    {
      headers: {
        authorization: nearogramToken,
      },
      params: {
        crowdfundId: cfId,
      },
    }
  );
};

export default getCfTransactions;
