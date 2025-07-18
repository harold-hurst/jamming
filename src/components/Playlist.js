import { useState } from "react";

export default function Playlist({ playlist, removeFromPlaylist, resetPlaylist }) {
  // store for holding the playlist name
  const [playlistName, setPlaylistName] = useState("");
  const [savedPlaylists, setSavedPlaylists] = useState([]);

  const handleSavePlaylist = () => {
    if (!playlistName || playlist.length === 0) return;
    setSavedPlaylists([
      ...savedPlaylists,
      { name: playlistName, songs: playlist },
    ]);
    resetPlaylist();
    setPlaylistName("");
  };

  return (
    <section className="w-full md:w-96 flex flex-col gap-6">
      <div className="bg-white rounded shadow-lg border border-gray-200 p-4 flex flex-col flex-1">
        <input
          type="text"
          placeholder="Playlist name"
          className="w-full px-3 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-lg"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
        <h2 className="text-xl font-semibold mb-4">Playlist</h2>
        <ul className="space-y-3 flex-1">
          {playlist.length === 0 && (
            <li className="text-gray-400">No songs added yet.</li>
          )}
          {playlist.map((song) => (
            <li
              key={song.id}
              className="flex items-center justify-between border-b border-gray-100 pb-2"
            >
              <div>
                <span className="font-medium">{song.title}</span>
                <span className="text-gray-500 ml-2">by {song.artist}</span>
              </div>
              <button
                className="ml-4 px-2 py-1 text-xs text-red-500 hover:underline cursor-pointer"
                onClick={() => removeFromPlaylist(song.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition cursor-pointer"
          disabled={!playlistName || playlist.length === 0}
          onClick={handleSavePlaylist}
        >
          Save Playlist
        </button>
      </div>
      {/* Saved Playlists */}
      {savedPlaylists.length > 0 && (
        <div className="bg-white rounded shadow-lg border border-gray-200 p-4 mt-4">
          <h2 className="text-xl font-semibold mb-4">Saved Playlists</h2>
          <ul className="space-y-6">
            {savedPlaylists.map((pl, idx) => {
              // Get unique artists in the playlist
              const uniqueArtists = new Set();
              pl.songs.forEach((song) => {
                song.artist
                  .split(",")
                  .forEach((a) => uniqueArtists.add(a.trim()));
              });
              return (
                <li key={idx}>
                  <div className="font-bold mb-2">{pl.name}</div>
                  <div className="ml-4 text-gray-600 text-sm">
                    {pl.songs.length} {pl.songs.length === 1 ? "song" : "songs"}{" "}
                    &middot; {uniqueArtists.size}{" "}
                    {uniqueArtists.size === 1 ? "artist" : "artists"}
                  </div>
                  {idx < savedPlaylists.length - 1 && (
                    <hr className="my-4 border-t border-gray-200" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
