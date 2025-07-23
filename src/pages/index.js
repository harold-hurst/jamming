"use client";

import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState, useEffect } from "react";

import Header from "@/components/Header";
import Profile from "@/components/Profile";
import SearchSection from "@/components/SearchSection";
import Playlist from "@/components/Playlist";
import SpotifyPlaylists from "@/components/SpotifyPlaylists";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { redirectToAuthCodeFlow, logout } from "@/pages/api/spotifyLogin";

import { getAccessToken, fetchProfile } from "@/pages/api/spotifyFunctions";
import { fetchPlaylists } from "@/pages/api/fetchPlaylists";

export default function Home() {
  const clientId = "7f128ca60395447889873922956dd74a";

  // =============================================================

  // set the code from the URL parameters
  const [authCode, setAuthCode] = useState(null);

  // store for holding the access token
  const [accessToken, setAccessToken] = useState(null);

  // =============================================================

  // store for holding the added playlist songs
  const [playlist, setPlaylist] = useState([]);

  // profile object saved after authentication
  const [profile, setProfile] = useState(null);

  // show or hide profile section
  const [showProfile, setShowProfile] = useState(true);

  // store for holding Spotify playlists
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // =============================================================

  // if authCode present in URL try to get the code from the URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search); // Get URL parameters
    const authCodeFromUrl = params.get("code");

    if (authCodeFromUrl) {
      setAuthCode(authCodeFromUrl);
    }
  }, []);

  // =============================================================

  // then fetch the access token using the authCode
  useEffect(() => {
    const fetchToken = async () => {
      if (!authCode) return;
      const token = await getAccessToken(clientId, authCode);
      setAccessToken(token);
    };

    fetchToken();
  }, [authCode]);

  // =============================================================

  // fetch profile and playlists once accessToken is set
  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        const [profileData, playlistsData] = await Promise.all([
          fetchProfile(accessToken),
          fetchPlaylists(accessToken),
        ]);

        setProfile(profileData);
        setSpotifyPlaylists(playlistsData.items);
      } catch (error) {
        console.error("Spotify API error:", error);
      }
    };

    fetchData();
  }, [accessToken]);

  // =============================================================

  // Fetch playlists whenever refreshTrigger changes
  useEffect(() => {
    if (!accessToken) return;

    playlistsData = fetchPlaylists(accessToken);
    setSpotifyPlaylists(playlistsData.items);

    // const loadPlaylists = async () => {
    //   const data = await fetchPlaylists(accessToken);
    //   setPlaylists(data.items);
    // };

    // loadPlaylists();

  }, [refreshTrigger]);

  // =============================================================

    // Function to trigger refresh
  const refreshPlaylists = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // handle login
  const handleLogin = async () => {
    redirectToAuthCodeFlow(clientId);
  };

  // handle logout
  const handleLogout = async () => {};

  const resetPlaylist = () => {
    setPlaylist([]);
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

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid grid-rows-[60px_1fr_20px] pb-8 items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]`}
    >
      <Header profile={profile} handleLogin={handleLogin} logout={logout} />

      <main className="p-6 pt-12 md:p-12 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8 flex-1 mb-8">
          {/* Profile Section */}
          {showProfile && (
            <Profile
              profile={profile}
              setShowProfile={setShowProfile}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
            />
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8 flex-1 mb-8">
          {/* Search & Results */}
          <SearchSection playlist={playlist} addToPlaylist={addToPlaylist} />

          {/* Playlist */}

          <Playlist
            playlist={playlist}
            removeFromPlaylist={removeFromPlaylist}
            resetPlaylist={resetPlaylist}
            profile={profile}
            accessToken={accessToken}
            refreshPlaylists={refreshPlaylists}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-8 flex-1 mb-8">
          <SpotifyPlaylists
            spotifyPlaylists={spotifyPlaylists}
            profile={profile}
          />
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
