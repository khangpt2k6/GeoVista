"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabase/client"
import Link from "next/link"

export default function UserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await fetch("/auth/logout", { method: "POST" })
    window.location.href = "/"
  }

  if (loading) {
    return <div className="user-profile-loading">Loading...</div>
  }

  if (!user) {
    return (
      <div className="user-profile-buttons">
        <Link href="/auth/login" className="login-button">
          <i className="fas fa-sign-in-alt"></i> Sign In
        </Link>
        <Link href="/auth/signup" className="signup-button">
          <i className="fas fa-user-plus"></i> Sign Up
        </Link>
      </div>
    )
  }

  return (
    <div className="user-profile">
      <div className="user-info">
        <div className="user-avatar">{user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}</div>
        <div className="user-details">
          <div className="user-name">{user.user_metadata?.full_name || "User"}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </div>
      <button onClick={handleLogout} className="logout-button">
        <i className="fas fa-sign-out-alt"></i> Logout
      </button>

      <style jsx>{`
        .user-profile {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a73e8, #7b2cbf);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .user-name {
          font-weight: 600;
          color: #333;
        }
        
        .user-email {
          font-size: 0.9rem;
          color: #666;
        }
        
        .logout-button {
          padding: 0.5rem 1rem;
          background: #f5f5f5;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }
        
        .logout-button:hover {
          background: #e0e0e0;
        }
        
        .user-profile-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .login-button, .signup-button {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          transition: all 0.3s;
        }
        
        .login-button {
          background: white;
          color: #1a73e8;
          border: 1px solid #1a73e8;
        }
        
        .signup-button {
          background: #1a73e8;
          color: white;
          border: 1px solid #1a73e8;
        }
        
        .login-button:hover, .signup-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}

