import axios from "axios";

const token = localStorage.getItem("token"); 

export const uploadCSV = async (formData) => {
  console.log("REq", `${process.env.NEXT_PUBLIC_BASE_URLNEXT_PUBLIC_BASE_URL}/upload`);
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/upload`,
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
