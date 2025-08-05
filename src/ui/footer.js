"use client";
import { useState, useEffect } from "react";

export default function Footer() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full py-4 bg-primary border-t border-accent text-center text-neutral-light text-sm">
      &copy; {year || ""} yuQuiz. All rights reserved.
    </footer>
  );
}