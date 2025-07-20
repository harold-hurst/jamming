import { useState } from "react";
import axios from "axios";

export default function SpotifyPlaylists({ spotifyPlaylists }) {
  const [loading, setLoading] = useState(false);


  return (
    <section className="bg-white rounded shadow-lg border border-gray-200 p-6 w-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Spotify Playlists</h2>
      {spotifyPlaylists.length === 0 && (
        <button
          className="mb-4 px-5 py-3 bg-black text-white rounded hover:bg-gray-800 text-lg font-semibold transition cursor-pointer"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load Spotify Playlists"}
        </button>
      )}
      {spotifyPlaylists.length > 0 ? (
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
        !loading && (
          <div className="text-gray-500 text-base">No playlists loaded.</div>
        )
      )}
    </section>
  );
}
