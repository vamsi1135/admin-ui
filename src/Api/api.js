 
 import axios from "axios";
 
const BACKEND_ENDPOINT =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

 const fetchUserData = async () => {
  try {
    const res = await axios.get(`${BACKEND_ENDPOINT}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export {fetchUserData};