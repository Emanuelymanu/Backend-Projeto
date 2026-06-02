import axios from 'axios';

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

export const fetchFromGoogle = async (query: string) => {
    const params: Record<string, string> = { q: query };

    if (API_KEY) {
        params.key = API_KEY;
    }

    const response = await axios.get(BASE_URL, { params });
    return response.data.items ?? [];
};