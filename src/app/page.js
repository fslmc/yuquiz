import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-12">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-highlight mb-4 text-center drop-shadow-lg">
          Welcome to yuQuiz
        </h1>
        <p className="text-lg sm:text-xl text-neutral-light max-w-2xl text-center mb-8">
          Challenge your friends, test your knowledge, and climb the leaderboard on the ultimate quiz game platform!
        </p>
        <Link 
          href="/quizzes" 
          className="bg-accent hover:bg-accent-alt text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-colors text-lg"
        >
          Start Playing
        </Link>
      </main>
    </div>
  );
}
