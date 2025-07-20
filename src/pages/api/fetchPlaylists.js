// Fetch and return all Spotify playlists for the current user
export async function fetchPlaylists(token) {
  const result = await fetch("https://api.spotify.com/v1/me/playlists", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}