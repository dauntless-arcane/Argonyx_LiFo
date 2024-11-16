import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = 3000;

// HERE API credentials
const HERE_API_KEY = process.env.HERE_API_KEY;

// Function to fetch location details from HERE Maps
async function getLocationDetails(address) {
    const url = `https://geocode.search.hereapi.com/v1/geocode`;
    const params = {
        q: address,
        apiKey: HERE_API_KEY,
    };

    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching location details:", error.response ? error.response.data : error.message);
        throw error;
    }
}

// Function to fetch nearby restaurants using OpenStreetMap Overpass API
async function getNearbyRestaurants(lat, lng) {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const query = `
        [out:json];
        (
            node["amenity"="restaurant"](around:5000, ${lat}, ${lng});
            way["amenity"="restaurant"](around:5000, ${lat}, ${lng});
            relation["amenity"="restaurant"](around:5000, ${lat}, ${lng});
        );
        out center;
    `;

    try {
        const response = await axios.post(overpassUrl, query, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return response.data.elements;
    } catch (error) {
        console.error("Error fetching data from Overpass API:", error.message);
        throw error;
    }
}

// Define the /restaurants route using OpenStreetMap
app.get('/restaurants', async (req, res) => {
    const lat = req.query.lat || 37.7749; // Default latitude (San Francisco)
    const lng = req.query.lng || -122.4194; // Default longitude (San Francisco)

    try {
        const data = await getNearbyRestaurants(lat, lng);
        const restaurants = data.map((item) => ({
            name: item.tags?.name || "Unnamed Restaurant",
            lat: item.lat || item.center?.lat,
            lon: item.lon || item.center?.lon,
        }));
        res.json(restaurants);
    } catch (error) {
        res.status(500).send('Error fetching restaurants');
    }
});

// Define the /hotels route using HERE API
app.get('/landmarks', async (req, res) => {
    const location = req.query.location || 'bangalore, india';

    try {
        const locationDetails = await getLocationDetails(`${location} `);
        res.json(locationDetails);
    } catch (error) {
        res.status(500).send('Error fetching hotel data');
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the API for Restaurants and Hotels!');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});