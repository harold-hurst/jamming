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

import { redirectToAuthCodeFlow } from "@/pages/api/spotifyLogin";

import { getAccessToken, fetchProfile } from "@/pages/api/spotifyFunctions";
import { fetchPlaylists } from "@/pages/api/fetchPlaylists";

export default function Home() {

  const clientId = "7f128ca60395447889873922956dd74a";

  // store for holding the added playlist songs
  const [playlist, setPlaylist] = useState([]);

  // profile object saved after authentication
  const [profile, setProfile] = useState(null);

  // set the code from the URL parameters
  const [code, setCode] = useState(null);

  // show or hide profile section
  const [showProfile, setShowProfile] = useState(true);

  // store for holding Spotify playlists
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);

  // if code present in URL try to get the code from the URL parameters
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

    const fetchSpotifyPlaylists = async () => {
      try {
        const accessToken = await getAccessToken(clientId, code);
        const playlists = await fetchPlaylists(accessToken);
        setSpotifyPlaylists(playlists.items || []);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchProfileData();
    fetchSpotifyPlaylists();
  }, [code]);

  // handle login
  const handleLogin = async () => {
    redirectToAuthCodeFlow(clientId);
  };

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
      <Header profile={profile} />

      <main className="p-6 pt-12 md:p-12 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8 flex-1 mb-8">
          {/* Profile Section */}
          {showProfile && (
            <Profile
              profile={profile}
              setShowProfile={setShowProfile}
              handleLogin={handleLogin}
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
          />
        </div>
        <div className="flex flex-col md:flex-row gap-8 flex-1 mb-8">
          <SpotifyPlaylists spotifyPlaylists={spotifyPlaylists} />
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
