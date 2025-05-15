import axios from "axios";

export const sendOtp = async (email) => {
    try {
        const res = await axios.post(
            `${process.env.BASE_URL}/auth/request-otp`,
            { email },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return res;
    } catch (err) {
        throw err;
    }
};

export const verifyOtp = async (email, otp) => {
    try {
        const res = await axios.post(
            `${process.env.BASE_URL}/auth/verify-otp`,
            { email, otp },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return res;
    } catch (err) {
        throw err;
    }
};