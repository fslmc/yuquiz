"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    setLoading(false)

    if (result.error) {
      setError("Invalid email or password")
    } else {
      // Redirect to home or profile page after successful sign in
      window.location.href = "/"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-sans px-4">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-red-600 mb-6 text-center drop-shadow-lg">Sign In</h2>
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        <label className="block mb-4">
          <span className="block text-white mb-1">Email</span>
          <input
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </label>
        <label className="block mb-6">
          <span className="block text-white mb-1">Password</span>
          <input
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <p className="mt-4 text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-red-600 hover:underline font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}
