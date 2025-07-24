import { useEffect, useState } from "react";

export default function SpotifyPlaylists({ spotifyPlaylists, profile }) {
  
  const isDisabled = !profile;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [spotifyPlaylists]);

  return (
    <section
      className={`bg-white rounded shadow-lg border border-gray-200 p-6 w-full flex flex-col transition ${
        isDisabled ? "opacity-50 pointer-events-none select-none" : ""
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Your Spotify Playlists</h2>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <svg
            className="animate-spin h-8 w-8 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      ) : spotifyPlaylists.length > 0 ? (
        <ul className="space-y-2">
          {spotifyPlaylists.map((playlist) => (
            <li key={playlist.id} className="border-b border-gray-100 pb-2">
              <span className="font-medium">{playlist.name}</span>
              <span className="text-gray-500 ml-2">
                by {playlist.owner.display_name} &middot;{" "}
                {playlist.tracks.total} tracks
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 text-base">No Spotify Playlists.</div>
      )}
    </section>
  );
}
