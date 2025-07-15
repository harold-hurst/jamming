import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";

import axios from "axios";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [inputValue, setInputValue] = useState(""); // for the input field
  const [searchTerm, setSearchTerm] = useState(""); // for the actual search

  const [results, setResults] = useState([]);

  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [savedPlaylists, setSavedPlaylists] = useState([]);

  // Filter results based on search term
  const filteredResults = results.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToPlaylist = (song) => {
    if (!playlist.find((s) => s.id === song.id)) {
      setPlaylist([...playlist, song]);
    }
  };

  const removeFromPlaylist = (songId) => {
    setPlaylist(playlist.filter((s) => s.id !== songId));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    // Set the search term to the input value
    setSearchTerm(inputValue);
    try {
      const res = await axios.get(`/api/spotify`, {
        params: {
          query: searchTerm || inputValue, // Use searchTerm  or inputValue
          limit: 5, // Limit results to 5 tracks
        },
      });
      setResults(
        res.data.map((track) => ({
          id: track.id,
          title: track.name,
          artist: track.artists.map((artist) => artist.name).join(", "),
        }))
      );
      setSearchTerm(""); // Clear the search term
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSavePlaylist = () => {
    if (!playlistName || playlist.length === 0) return;
    setSavedPlaylists([
      ...savedPlaylists,
      { name: playlistName, songs: playlist },
    ]);
    setPlaylist([]);
    setPlaylistName("");
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      {/* Header */}
      <header className="w-full bg-black text-white py-6 px-4 text-3xl font-bold text-center">
        Jamming
      </header>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row gap-8 flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full">
        {/* Search & Results */}
        <section className="flex-1 flex flex-col gap-6">
          <form className="flex gap-2" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for a song..."
              className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-lg"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              className="px-5 py-3 bg-black text-white rounded hover:bg-gray-800 text-lg font-semibold"
            >
              Search
            </button>
          </form>
          <div className="bg-white rounded shadow p-4 flex-1">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <ul className="space-y-3">
              {filteredResults.length === 0 && (
                <li className="text-gray-400">No results found.</li>
              )}
              {filteredResults.map((song) => (
                <li
                  key={song.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-2"
                >
                  <div>
                    <span className="font-medium">{song.title}</span>
                    <span className="text-gray-500 ml-2">by {song.artist}</span>
                  </div>
                  <button
                    className="ml-4 px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm"
                    onClick={() => addToPlaylist(song)}
                    disabled={playlist.find((s) => s.id === song.id)}
                  >
                    {playlist.find((s) => s.id === song.id) ? "Added" : "Add"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Playlist */}
        <section className="w-full md:w-96 flex flex-col gap-6">
          <div className="bg-white rounded shadow p-4 flex flex-col flex-1">
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
                    className="ml-4 px-2 py-1 text-xs text-red-500 hover:underline"
                    onClick={() => removeFromPlaylist(song.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition"
              disabled={!playlistName || playlist.length === 0}
              onClick={handleSavePlaylist}
            >
              Save Playlist
            </button>
          </div>
          {/* Saved Playlists */}
          {savedPlaylists.length > 0 && (
            <div className="bg-white rounded shadow p-4 mt-4">
              <h2 className="text-xl font-semibold mb-4">Saved Playlists</h2>
              <ul className="space-y-6">
                {savedPlaylists.map((pl, idx) => (
                  <li key={idx}>
                    <div className="font-bold mb-2">{pl.name}</div>
                    <ul className="ml-4 list-disc">
                      {pl.songs.map((song) => (
                        <li key={song.id}>
                          <span className="font-medium">{song.title}</span>
                          <span className="text-gray-500 ml-2">
                            by {song.artist}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
