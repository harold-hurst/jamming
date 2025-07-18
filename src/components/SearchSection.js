import { useState } from "react";

import axios from "axios";

export default function SearchSection({ playlist, addToPlaylist }) {
  // store the value in the search field
  const [inputValue, setInputValue] = useState("");

  // results of the song search
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`/api/spotifySearch`, {
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

  return (
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
          className="px-5 py-3 bg-black text-white rounded hover:bg-gray-800 text-lg font-semibold cursor-pointer"
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
                <span className="text-gray-500 ml-2">by {song.artist}</span>
              </div>
              <button
                className="ml-4 px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm cursor-pointer"
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
  );
}
