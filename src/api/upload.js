import axios from "axios";

export const uploadCSV = async (formData) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
