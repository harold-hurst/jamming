// /pages/api/spotify.js

import axios from 'axios';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

async function getAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

  const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await axios.post(SPOTIFY_TOKEN_URL, 'grant_type=client_credentials', {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data.access_token;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Get access token
      const accessToken = await getAccessToken();

      // Query Spotify API
      const searchQuery = req.query.query || 'Blinding Lights';  // Default query
      const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: searchQuery,
          type: 'track',
          limit: 5,  // Limit results to 5 tracks
        },
      });

      res.status(200).json(response.data.tracks.items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data from Spotify' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
