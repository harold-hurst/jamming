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

  const [results, setResults] = useState([]);

  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [savedPlaylists, setSavedPlaylists] = useState([]);

  // Filter results based on search term
  const filteredResults = results.filter(
    (song) =>
      song.title.toLowerCase().includes(inputValue.toLowerCase()) ||
      song.artist.toLowerCase().includes(inputValue.toLowerCase())
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

    try {
      const res = await axios.get(`/api/spotify`, {
        params: {
          query: inputValue,
        },
      });

      setResults(
        res.data.map((track) => ({
          id: track.id,
          title: track.name,
          artist: track.artists.map((artist) => artist.name).join(", "),
        }))
      );
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
      className={`${geistSans.className} ${geistMono.className} grid grid-rows-[60px_1fr_20px] pb-8 items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]`}
    >

        <header className="w-full h-16 bg-black text-white py-16 px-4 text-3xl font-bold text-center">
          Ja
          <span className="text-green-600">m</span>
          <span className="text-green-600">m</span>
          ing
        </header>

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
          <div className="bg-white rounded shadow-lg border border-gray-200 p-4 flex-1">
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
            <div className="bg-white rounded shadow-lg border border-gray-200 p-4 mt-4">
              <h2 className="text-xl font-semibold mb-4">Saved Playlists</h2>
              <ul className="space-y-6">
                {savedPlaylists.map((pl, idx) => {
                  // Get unique artists in the playlist
                  const uniqueArtists = new Set();
                  pl.songs.forEach(song => {
                    song.artist.split(",").forEach(a => uniqueArtists.add(a.trim()));
                  });
                  return (
                    <li key={idx}>
                      <div className="font-bold mb-2">{pl.name}</div>
                      <div className="ml-4 text-gray-600 text-sm">
                        {pl.songs.length} {pl.songs.length === 1 ? "song" : "songs"} &middot;{" "}
                        {uniqueArtists.size} {uniqueArtists.size === 1 ? "artist" : "artists"}
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
      </main>
      <footer>
        <div className="text-center text-gray-500 text-sm">
          Made with Next.js and Spotify API
        </div>
      </footer>
    </div>
  );
}
