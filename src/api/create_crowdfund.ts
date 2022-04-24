import axios from "axios";
import { environment } from "../environment";

const createCrowdfund = (
  crowdfundName: any,
  deadline: any,
  description: any,
  targetValue: any,
  minAmount: any,
  nearogramToken: any
) => {
  return axios.post(
    `${environment.BACKEND_URL}/crowdfund/createNewCrowdfund`,
    {
      crowdfundName: crowdfundName,
      deadline: deadline,
      description: description,
      targetValue: targetValue,
      minAmount: minAmount,
    },
    {
      headers: {
        authorization: nearogramToken,
      },
    }
  );
};

export default createCrowdfund;
