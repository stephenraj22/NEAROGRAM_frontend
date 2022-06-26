import axios from "axios";
import { environment } from "../environment";

const transact = (
  amount: any,
  walletId: any,
  flag: any,
  nearogramToken: any
) => {
  return axios.post(
    `${environment.BACKEND_URL}/transaction/transact`,
    {
      toWalletId: String(walletId),
      amount: Number(amount),
      flag: flag,
    },
    {
      headers: {
        authorization: nearogramToken,
      },
    }
  );
};

export default transact;
