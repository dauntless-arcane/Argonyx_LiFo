import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = 3000;

// HERE API credentials
const HERE_API_KEY = process.env.HERE_API_KEY;

// Function to fetch location details from HERE Maps (Geocode API)
async function getLocationDetails(address) {
    const url = `https://geocode.search.hereapi.com/v1/geocode`;
    const params = {
        q: address,
        apiKey: HERE_API_KEY,
    };

    try {
        const response = await axios.get(url, { params });
        return response.data.items[0].position; // Return latitude and longitude
    } catch (error) {
        console.error("Error fetching location details:", error.response ? error.response.data : error.message);
        throw error;
    }
}

// Function to fetch famous places using Overpass API (OpenStreetMap)
async function getFamousPlaces(lat, lng) {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const query = `
        [out:json];
        (
            // Tourism attractions
            node["tourism"="attraction"](around:5000, ${lat}, ${lng});
            way["tourism"="attraction"](around:5000, ${lat}, ${lng});
            relation["tourism"="attraction"](around:5000, ${lat}, ${lng});
            
            // Parks
            node["leisure"="park"](around:5000, ${lat}, ${lng});
            way["leisure"="park"](around:5000, ${lat}, ${lng});
            relation["leisure"="park"](around:5000, ${lat}, ${lng});
            
            // Malls
            node["shop"="mall"](around:5000, ${lat}, ${lng});
            way["shop"="mall"](around:5000, ${lat}, ${lng});
            relation["shop"="mall"](around:5000, ${lat}, ${lng});
        );
        out body;
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

async function getHotels(lat, lng) {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const query = `
        [out:json];
        (
            // Hotels
            node["tourism"="hotel"](around:5000, ${lat}, ${lng});
            way["tourism"="hotel"](around:5000, ${lat}, ${lng});
            relation["tourism"="hotel"](around:5000, ${lat}, ${lng});
        );
        out body;
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

async function getNearbyRestaurants(lat, lng) {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const query = `
        [out:json];
        (
            node["amenity"="restaurant"](around:5000, ${lat}, ${lng});
            way["amenity"="restaurant"](around:5000, ${lat}, ${lng});
            relation["amenity"="restaurant"](around:5000, ${lat}, ${lng});
        );
        out body;
    `;
    try {
        const response = await axios.post(overpassUrl, query, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return response.data.elements;
    } catch (error) {
        console.error("Error fetching restaurant data:", error.message);
        throw error;
    }
}


app.get('/FamousPlaces', async (req, res) => {
    const city = req.query.city || 'Bangalore'; // Default city if not provided

    try {
        const locationDetails = await getLocationDetails(city);
        const lat = locationDetails.lat;
        const lng = locationDetails.lng;

        // Fetch famous places around the coordinates
        const places = await getFamousPlaces(lat, lng);
        const famousPlaces = places.map((place) => ({
            name: place.tags?.name || "Unnamed Place",
            type: place.tags?.tourism || "Unknown Type",
            lat: place.lat || place.center?.lat,
            lon: place.lon || place.center?.lon,
        }));

        res.json(famousPlaces);
    } catch (error) {
        res.status(500).send('Error fetching famous places');
    }
});

app.get('/hotels', async (req, res) => {
    const city = req.query.city || 'Bangalore'; // Default city if not provided

    try {
        const locationDetails = await getLocationDetails(city);
        const lat = locationDetails.lat;
        const lng = locationDetails.lng;

        // Fetch famous places around the coordinates
        const places = await getHotels(lat, lng);
        const famousPlaces = places.map((place) => ({
            name: place.tags?.name || "Unnamed Place",
            type: place.tags?.tourism || "Unknown Type",
            lat: place.lat || place.center?.lat,
            lon: place.lon || place.center?.lon,
        }));

        res.json(famousPlaces);
    } catch (error) {
        res.status(500).send('Error fetching famous places');
    }
});

app.get('/restaurants', async (req, res) => {
    const lat = req.query.lat || 37.7749; // Default latitude (San Francisco)
    const lng = req.query.lng || -122.4194; // Default longitude (San Francisco)

    try {
        const data = await  getNearbyRestaurants(lat, lng);
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

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the API for Famous Places, Restaurants, and Hotels!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


