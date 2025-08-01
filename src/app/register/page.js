'use client';

import { useState } from 'react';

export default function Register() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        event.target.reset();
      } else {
        const json = await res.json();
        setError(json.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-sans px-4">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-red-600 mb-6 text-center drop-shadow-lg">Register</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {success && <p className="mb-4 text-green-500">Registration successful! You can now sign in.</p>}
        <label className="block mb-4">
          <span className="block text-white mb-1">Name</span>
          <input
            name="name"
            type="text"
            required
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </label>
        <label className="block mb-4">
          <span className="block text-white mb-1">Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </label>
        <label className="block mb-6">
          <span className="block text-white mb-1">Password</span>
          <input
            name="password"
            type="password"
            required
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
}
