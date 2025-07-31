"use client";
import { useState } from "react";

export default function Footer() {
    const [year, setYear] = useState(null);

    useState(() => {
        setYear(new Date().getFullYear());
    }, []);

  return (
    <footer className="w-full py-4 bg-black border-t border-red-600 text-center text-gray-400 text-sm">
      &copy; {year || ""} yuQuiz. All rights reserved.
    </footer>
  );
}
