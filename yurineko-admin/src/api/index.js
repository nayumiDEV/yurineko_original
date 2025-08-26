import axios from "axios";
import Cookies from "universal-cookie";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const cookies = new Cookies();

export default async function callApi({
  url,
  method,
  data,
  option,
  config = {},
}) {
  // const token = localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')).token : ''\
  const admin = cookies.get("admin");
  const token = admin ? admin.token : "";
  return new Promise((resolve, reject) => {
    axios({
      method,
      url: url.includes("http") ? url : `${BASE_URL}${url}`,
      data,
      headers: { ...option?.headers, Authorization: `Bearer ${token}` },
      ...config,
      // ...option,
    })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
