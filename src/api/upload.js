import axios from "axios";

const token = localStorage.getItem("token"); 

export const uploadCSV = async (formData) => {
  const res = await axios.post(
    `${process.env.BASE_URL}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );
  return res.data;
};
