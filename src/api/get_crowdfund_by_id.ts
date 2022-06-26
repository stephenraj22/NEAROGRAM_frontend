import axios from "axios";
import { environment } from "../environment";

const getCfById = (cfId: any, nearogramToken: any) => {
  return axios.post(
    `${environment.BACKEND_URL}/crowdfund/getCrowdfundById`,
    {
      cfId: cfId,
    },
    {
      headers: {
        authorization: nearogramToken,
      },
    }
  );
};

export default getCfById;
