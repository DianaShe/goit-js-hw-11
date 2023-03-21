import axios from 'axios';

export default class ApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.limit = 40;
        this.totalImages = 0;
        this.url = "https://pixabay.com/api/"
    };
    
    async fetchImages() {
        this.searchParams = new URLSearchParams({
            q : this.searchQuery,
            key: process.env.API_KEY,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            per_page: this.limit,
            page: this.page,
            
        });
        const response = await axios.get(`${this.url}?${this.searchParams}`);
        this.incrementPage();
        return response.data;
    };

    incrementPage() {
        this.page += 1;
    };

    resetPage() {
        this.page = 1;
    }

    
        

        
}
