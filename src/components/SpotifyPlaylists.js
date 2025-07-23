export default function SpotifyPlaylists({ spotifyPlaylists, profile }) {
  const isDisabled = !profile;

  return (
    <section
      className={`bg-white rounded shadow-lg border border-gray-200 p-6 w-full flex flex-col transition ${
        isDisabled ? "opacity-50 pointer-events-none select-none" : ""
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Your Spotify Playlists</h2>

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
        <div className="text-gray-500 text-base">No Spotify Playlists.</div>
      )}
    </section>
  );
}
