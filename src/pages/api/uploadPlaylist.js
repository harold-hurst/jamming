// API route to upload a playlist to Spotify for the current user
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Destructure the request body
  const { accessToken, name, description = "", public: isPublic = false, tracks = [] } = req.body;

  // Validate required fields
  if (!accessToken || !name || !Array.isArray(tracks)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {

    // 1. Get the current user's Spotify ID
    const userRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      const err = await userRes.json();
      return res.status(userRes.status).json({ error: "Failed to get user", details: err });
    }

    const userData = await userRes.json();
    const userId = userData.id;

    // 2. Create a new playlist for the user
    const createRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        public: isPublic,
      }),
    });

    const playlistData = await createRes.json();

    // Check if playlist creation was successful  || !playlistData.id
    if (!createRes.ok) {
        return createRes;
    //   return res.status(createRes.status || 500).json({ error: "Failed to create playlist step"});
    }

    // 3. Add tracks to the new playlist (if any)
    if (tracks.length > 0) {
      // Accept both array of objects with uri or array of uri strings
      const uris = tracks.map((track) => typeof track === "string" ? track : track.uri);
      const addTracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris }),
      });

      // Check if adding tracks was successful
      if (!addTracksRes.ok) {
        const err = await addTracksRes.json();
        return res.status(addTracksRes.status).json({ error: "Failed to add tracks", details: err });
      }
    }

    // 4. Respond with the created playlist data
    return res.status(200).json({ success: true, playlist: playlistData });
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({ error: "Failed to upload playlist", details: error.message });
  }
}