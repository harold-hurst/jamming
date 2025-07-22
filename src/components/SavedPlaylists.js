export default function savedPlaylists({ savedPlaylists, profile, accessToken }) {

  const handleUploadPlaylist = async (name, songs) => {

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

    const data = await response.json();

    if (response.ok) {
      console.log("Playlist uploaded:", data.playlist);
    } else {
      console.error("Upload failed:", data.error);
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
                  !profile ? "opacity-50 pointer-events-none select-none" : ""
                }`}
                title="Upload playlist to Spotify"
                disabled={!profile}
                onClick={() => handleUploadPlaylist(pl.name, pl.songs)}
              >
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
              </button>
              {idx < savedPlaylists.length - 1 && (
                <hr className="my-4 border-t border-gray-200 w-full" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
