import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = 3000;

// Replace with your actual API key from Aviationstack
const apiKey = process.env.AVIATIONSTACK_API_KEY || '27b51eada9cf8615dee2727b46d3c3d7';

// Function to fetch flight data
async function getFlightInfo(departureAirport, arrivalAirport, flightDate) {
    const baseUrl = 'http://api.aviationstack.com/v1/flights';
    const params = {
        access_key: apiKey,
        dep_iata: departureAirport, // Departure airport code (e.g., 'JFK')
        arr_iata: arrivalAirport,   // Arrival airport code (e.g., 'LAX')
        flight_date: flightDate     // Date in 'YYYY-MM-DD' format
    };

    try {
        const response = await axios.get(baseUrl, { params });
        return response.data.data; // Returns array of flights
    } catch (error) {
        console.error('Error fetching flight data:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Define the '/flights' endpoint
app.get('/flights', async (req, res) => {
    const { departure, arrival, date } = req.query;

    // Validate query parameters
    if (!departure || !arrival || !date) {
        return res.status(400).json({ error: 'Please provide departure, arrival, and date parameters.' });
    }

    try {
        const flights = await getFlightInfo(departure, arrival, date);

        if (!flights || flights.length === 0) {
            return res.status(404).json({ message: 'No flights found for the given route and date.' });
        }

        const flightDetails = flights.map((flight) => ({
            flightCode: flight.flight?.iata || 'Unknown',
            airline: flight.airline?.name || 'Unknown',
            departureAirport: flight.departure?.airport || 'Unknown',
            departureTime: flight.departure?.scheduled || 'Unknown',
            arrivalAirport: flight.arrival?.airport || 'Unknown',
            arrivalTime: flight.arrival?.scheduled || 'Unknown',
        }));

        res.json(flightDetails);
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching flight data.' });
    }
});

// Example root route
app.get('/', (req, res) => {
    res.send('Welcome to the Flight Information API!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/flights`);
});