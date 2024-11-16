
import axios from 'axios';
import dotenv from 'dotenv';
import http from 'http';

// Load environment variables
dotenv.config();

// HERE API credentials
const HERE_API_KEY = process.env.HERE_API_KEY;

// Function to get location details from HERE Maps
async function getLocationDetails(address) {
    const url = `https://geocode.search.hereapi.com/v1/geocode`;
    const params = {
        q: address,
        apiKey: HERE_API_KEY,
    };

    try {
        // Log the request URL and parameters
        console.log(`Requesting: ${url}?q=${address}&apiKey=${HERE_API_KEY}`);
        
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        // Log the full error response
        console.error("Error fetching location details:", error.response ? error.response.data : error.message);
        throw error;
    }
}
const location = 'indiranagar, bangalore';
// Create an HTTP server
const server = http.createServer(async (req, res) => {
    // Example address to search for
    const address = ` ${location} hotels`;

    try {
        const locationDetails = await getLocationDetails(address);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(locationDetails));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error fetching location details');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});