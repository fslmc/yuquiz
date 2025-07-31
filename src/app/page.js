export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-12">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-red-600 mb-4 text-center drop-shadow-lg">Welcome to yuQuiz</h1>
        <p className="text-lg sm:text-xl text-gray-200 max-w-2xl text-center mb-8">
          Challenge your friends, test your knowledge, and climb the leaderboard on the ultimate quiz game platform!
        </p>
        <a href="#play" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-colors text-lg">Start Playing</a>
      </main>

    </div>
  );
}
