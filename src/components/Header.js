export default function Header({ profile }) {
  return (
    <header className="w-full h-16 bg-black text-white py-16 px-4 text-3xl font-bold text-center flex flex-col">
      <span>
        Ja
        <span className="text-green-600">m</span>
        <span className="text-green-600">m</span>
        ing
      </span>

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
  );
}
