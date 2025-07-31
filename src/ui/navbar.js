
export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-black border-b border-red-600">
      <span className="text-2xl font-bold text-red-600 tracking-wide">yuQuiz</span>
      <div className="flex gap-6">
        <a href="#" className="hover:text-red-400 transition-colors">Home</a>
        <a href="#about" className="hover:text-red-400 transition-colors">About</a>
        <a href="#play" className="hover:text-red-400 transition-colors">Play</a>
      </div>
    </nav>
  );
}
