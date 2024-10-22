'use client';

import Link from 'next/link'
import { useAuth } from '@/components/context/AuthProvider'
import LoginForm from '@/components/LoginForm'
import { useEffect, useState } from 'react'

export default function Header() {
  const { user } = useAuth()
  const [showLoginForm, setShowLoginForm] = useState(false)

  useEffect(() => {
    if (user) {
      setShowLoginForm(false)
    }
  }, [user])

  return (
    <header className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          QuickType
        </Link>
        <nav>
          <Link href="/training" className="mx-4 hover:underline">
            Training
          </Link>
        </nav>
        {user ? (
          <Link href="/profile" className="hover:underline">
            Profile
          </Link>
        ) : (
          <button
            onClick={() => setShowLoginForm(true)}
            className="hover:underline"
          >
            Login
          </button>
        )}
      </div>
      {showLoginForm && !user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <LoginForm />
        </div>
      )}
    </header>
  )
}
