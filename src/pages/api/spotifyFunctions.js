// Functions for fetching the profile object once authenticated
export async function getAccessToken(clientId, code) {
  // Check for a saved access token in localStorage
  const savedToken = localStorage.getItem("access_token");
  if (savedToken) {
    return savedToken;
  }

  // Get stored code verifier for PKCE flow
  // stored during redirect to auth code flow
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "https://jamming-peach.vercel.app/");
  params.append("code_verifier", verifier);

  // Request a new access token from Spotify
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await result.json();
  const accessToken = data.access_token;

  // Save the token for later use
  if (accessToken) {
    localStorage.setItem("access_token", accessToken);
  }

  return accessToken;
}


// Return spotify profile data
export async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}