import axios from "axios";

const token = localStorage.getItem("token");

export const fetchCollections = async (isPublic) => {
    try {
        const endpoint = isPublic
            ? `${process.env.NEXT_PUBLIC_BASE_URL}/collections/global`
            : `${process.env.NEXT_PUBLIC_BASE_URL}/collections`;
        console.log(endpoint);
        const { data } = await axios.get(endpoint, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

        return { data };
    } catch (err) {
        throw err;
    }
};

export const fetchCollection = async (id) => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/collections/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const toggleDone = async (id, questionId) => {
    try {
        await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/collections/toggle-done/${id}/${questionId}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    } catch (err) {
        throw err;
    }
}

export const toggleRevision = async (id, questionId) => {
    try {
        await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/collections/toggle-revision/${id}/${questionId}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    } catch (err) {
        throw err;
    }
}

export const updateNote = async (id, questionId, note) => {
    try {
        await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/collections/note/${id}/${questionId}`,
            { note },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

    } catch (err) {
        throw err;
    }
}