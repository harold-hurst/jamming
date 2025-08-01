import { useState } from "react";

export default function SavedPlaylists({
  savedPlaylists,
  removeFromSavedPlaylists,
  profile,
  accessToken,
  refreshSpotifyPlaylists
}) {
  const [uploadedIdx, setUploadedIdx] = useState(null);

  const handleUploadPlaylist = async (name, songs, idx) => {
    const response = await fetch("/api/uploadPlaylist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: accessToken, // Use the accessToken prop
        name: name,
        description: "Created with my Jamming app",
        public: true,
        tracks: songs,
      }),
    });

    // console.log("Response:", response);

    const data = await response.json();

    if (response.ok) {
      // change the icon to a tick mark
      setUploadedIdx(idx); // Set the uploaded index to change the icon
      setTimeout(() => {
        removeFromSavedPlaylists(idx); // Remove the playlist from saved playlists
        refreshSpotifyPlaylists(); // Trigger a refresh of playlists after a short delay
        setUploadedIdx(null); // Reset uploaded index after a delay
      }, 2000);
    } else {
      //   console.error("Upload failed:", data.error);
    }
  };

  return (
    <div className="bg-white rounded shadow-lg border border-gray-200 p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">Saved Playlists</h2>
      <ul className="space-y-6">
        {savedPlaylists.map((pl, idx) => {
          // Get unique artists in the playlist
          const uniqueArtists = new Set();
          pl.songs.forEach((song) => {
            song.artist.split(",").forEach((a) => uniqueArtists.add(a.trim()));
          });
          return (
            <>
              <li key={idx} className="flex items-center justify-between">
                
                <div>
                  <div className="font-bold mb-2">{pl.name}</div>
                  <div className="ml-4 text-gray-600 text-sm">
                    {pl.songs.length} {pl.songs.length === 1 ? "song" : "songs"}{" "}
                    &middot; {uniqueArtists.size}{" "}
                    {uniqueArtists.size === 1 ? "artist" : "artists"}
                  </div>
                </div>

                <button
                  className={`ml-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 transition cursor-pointer ${
                    !profile || uploadedIdx === idx ? "opacity-50 pointer-events-none select-none" : ""
                  }`}
                  title="Upload playlist to Spotify"
                  disabled={!profile || uploadedIdx === idx}
                  onClick={() => handleUploadPlaylist(pl.name, pl.songs, idx)}
                >
                  {uploadedIdx === idx ? (
                    // Success check icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    // Upload icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                  )}
                </button>
              </li>
              {idx < savedPlaylists.length - 1 && (
                <hr className="my-4 border-t border-gray-200 w-full" />
              )}
            </>
          );
        })}
      </ul>
    </div>
  );
}