export default function Profile({ profile, setShowProfile, handleLogin }) {
  return (
    <section
      id="profile"
      className="bg-white rounded shadow-lg border border-gray-200 p-6 w-full flex flex-col items-center relative"
    >
      {profile && (
        <button
          onClick={() => setShowProfile(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl font-bold"
          aria-label="Close profile"
        >
          &times;
        </button>
      )}
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
          className="mb-4 px-5 py-3 bg-black text-white rounded hover:bg-gray-800 text-lg font-semibold cursor-pointer"
        >
          Connect to Spotify
        </button>
      )}

      {profile && (
        <ul className="text-gray-700 text-base mt-2 space-y-1 flex flex-col items-center justify-center">
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
        </ul>
      )}
    </section>
  );
}
