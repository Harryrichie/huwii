"use client"

import React, { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ClerkError {
  errors?: {
    longMessage?: string
  }[]
}

export default function ResetPassword() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Step 1: Send reset code
  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError("")

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      setSuccessfulCreation(true)
    } catch (err) {
      const error = err as ClerkError
      console.error("error", error.errors?.[0]?.longMessage)
      setError(error.errors?.[0]?.longMessage || "Something went wrong")
    } finally {
        setLoading(false)
    }
  }

  // Step 2: Verify code and set new password
  const reset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError("")

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })

      if (result.status === "complete") {
        setActive({ session: result.createdSessionId })
        sessionStorage.removeItem('huwii-chat-history')
        sessionStorage.removeItem('huwii-image-session-id')
        sessionStorage.removeItem('huwii-image-messages')
        setComplete(true)
        setTimeout(() => router.push("/dashboard/user"), 2000)
      } else {
        console.log(result)
        setError("Failed to reset password. Please try again.")
      }
    } catch (err) {
      const error = err as ClerkError
      console.error("error", error.errors?.[0]?.longMessage)
      setError(error.errors?.[0]?.longMessage || "Something went wrong")
    } finally {
        setLoading(false)
    }
  }

  if (complete) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl text-center">
                <h2 className="text-2xl font-bold text-green-600">Password Reset Successfully!</h2>
                <p className="text-gray-600">Redirecting you to dashboard...</p>
            </div>
        </div>
      )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {!successfulCreation 
                ? "Enter your email address and we'll send you a code to reset your password." 
                : "Enter the code sent to your email and your new password."}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        {!successfulCreation ? (
          <form className="mt-8 space-y-6" onSubmit={create}>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={reset}>
            <div className="space-y-4">
              <div>
                <label htmlFor="code" className="sr-only">Verification Code</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter verification code"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">New Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="New password"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
            </button>
          </form>
        )}
        
        <div className="text-center">
            <Link href="/signin" className="flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
            </Link>
        </div>
      </div>
    </div>
  )
}
