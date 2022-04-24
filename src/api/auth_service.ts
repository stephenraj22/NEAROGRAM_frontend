import axios from "axios";
import { environment } from "../environment";

const signIn = (userObj: any) => {
  return axios.post(`${environment.BACKEND_URL}/accounts/signIn`, {
    user: userObj,
  });
};

export default signIn;
