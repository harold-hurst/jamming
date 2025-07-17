"use client";

import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState, useEffect } from "react";

import axios from "axios";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import {
  getAccessToken,
  fetchProfile,
  redirectToAuthCodeFlow,
} from "@/lib/spotifyLogin";

const clientId = process.env.SPOTIFY_CLIENT_ID;

export default function Home() {

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  
  // store the value in the search field
  const [inputValue, setInputValue] = useState(""); // for the input field

  // results of the song search
  const [results, setResults] = useState([]);

  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [savedPlaylists, setSavedPlaylists] = useState([]);

  // profile object saved after authentication
  const [profile, setProfile] = useState(null);

  // set the code from the URL parameters
  const [code, setCode] = useState(null);

  // try to get the code from the URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search); // Get URL parameters
    const codeFromUrl = params.get("code");
    if (codeFromUrl) {
      setCode(codeFromUrl);
    }
  }, []);

  // when code changes, we can use it to fetch the profile
  useEffect(() => {
    if (!code) return;

    const fetchProfileData = async () => {
      try {
        const accessToken = await getAccessToken(clientId, code);
        const profile = await fetchProfile(accessToken);
        setProfile(profile);
        console.log(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfileData();
  }, [code]);

  // handle login
  const handleLogin =  async () => {
    redirectToAuthCodeFlow(clientId);
  };

  // App functions
  // =====================================================================

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
      <header className="w-full h-16 bg-black text-white py-16 px-4 text-3xl font-bold text-center flex flex-col">
        <span>
          Ja
          <span className="text-green-600">m</span>
          <span className="text-green-600">m</span>
          ing
        </span>
        {/* Move headerAvatar to the end of header */}

        <div className="relative max-w-6xl mx-auto p-4 w-full flex-1 mt-auto">
          <div
            id="headerAvatar"
            className="absolute right-6 md:right-12 bottom-0 translate-y-1/2
"
          >
            {profile && profile.images && profile.images.length > 0 ? (
              <img
                src={profile.images[0].url}
                alt="Profile"
                className="rounded-full object-cover border-2 border-green-600 w-24 h-24"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A9 9 0 1112 21a8.963 8.963 0 01-6.879-3.196z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="p-6 pt-12 md:p-12 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8 flex-1 mb-8">
          {/* Profile Section */}
          <section
            id="profile"
            className="bg-white rounded shadow-lg border border-gray-200 p-6 w-full flex flex-col items-center"
          >
            <span id="avatar" className="mb-4">
              {profile && profile.images && profile.images.length > 0 ? (
                <img
                  src={profile.images[0].url}
                  alt="Profile"
                  className="rounded-full object-cover border-2 border-green-600 w-24 h-24"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.121 17.804A9 9 0 1112 21a8.963 8.963 0 01-6.879-3.196z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              )}
            </span>
            <h2 className="text-xl font-semibold mb-2">
              {profile ? (
                <>
                  Logged in as{" "}
                  <span id="displayName" className="text-green-600">
                    {profile.display_name}
                  </span>
                </>
              ) : (
                "Not logged in"
              )}
            </h2>

            {!profile && (
              <button
                onClick={handleLogin}
                className="mb-4 px-5 py-3 bg-black text-white rounded hover:bg-gray-800 text-lg font-semibold"
              >
                Connect to Spotify
              </button>
            )}

            {profile && (
              <ul className="text-gray-700 text-base w-full mt-2 space-y-1">
                <li>
                  User ID:{" "}
                  <span id="id" className="font-mono">
                    {profile ? profile.id : "..."}
                  </span>
                </li>
                <li>
                  Email:{" "}
                  <span id="email" className="font-mono">
                    {profile ? profile.email : "..."}
                  </span>
                </li>
                <li>
                  Spotify URI:{" "}
                  <a
                    id="uri"
                    href={profile ? profile.uri : "#"}
                    className="text-cyan-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile ? profile.uri : "..."}
                  </a>
                </li>
                <li>
                  Link:{" "}
                  <a
                    id="url"
                    href={profile ? profile.external_urls?.spotify : "#"}
                    className="text-cyan-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile ? profile.external_urls?.spotify : "..."}
                  </a>
                </li>
                <li>
                  Profile Image:{" "}
                  <span id="imgUrl" className="break-all">
                    {profile && profile.images && profile.images.length > 0
                      ? profile.images[0].url
                      : "No image"}
                  </span>
                </li>
              </ul>
            )}
          </section>
        </div>

        <div className="flex flex-col md:flex-row gap-8 flex-1">
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
                {results.length === 0 && (
                  <li className="text-gray-400">No results found.</li>
                )}
                {results.map((song) => (
                  <li
                    key={song.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-2"
                  >
                    <div>
                      <span className="font-medium">{song.title}</span>
                      <span className="text-gray-500 ml-2">
                        by {song.artist}
                      </span>
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
                      <span className="text-gray-500 ml-2">
                        by {song.artist}
                      </span>
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
                    pl.songs.forEach((song) => {
                      song.artist
                        .split(",")
                        .forEach((a) => uniqueArtists.add(a.trim()));
                    });
                    return (
                      <li key={idx}>
                        <div className="font-bold mb-2">{pl.name}</div>
                        <div className="ml-4 text-gray-600 text-sm">
                          {pl.songs.length}{" "}
                          {pl.songs.length === 1 ? "song" : "songs"} &middot;{" "}
                          {uniqueArtists.size}{" "}
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
        </div>
      </main>
      <footer>
        <div className="text-center text-gray-500 text-sm">
          Made with Next.js and Spotify API
        </div>
      </footer>
    </div>
  );
}
