import axios from 'axios';

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

export const fetchFromGoogle = async (query: string) =>{
    const response = await axios.get(`${BASE_URL}?q=${query}&key=${API_KEY}`);
    return response.data.items;
}