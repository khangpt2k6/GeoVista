"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabase/client"

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch favorites
        const { data, error } = await supabase
          .from("user_favorites")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching favorites:", error)
        } else {
          setFavorites(data || [])
        }
      }

      setLoading(false)
    }

    fetchUserAndFavorites()
  }, [])

  const removeFavorite = async (id) => {
    try {
      const { error } = await supabase.from("user_favorites").delete().eq("id", id)

      if (error) throw error

      // Update local state
      setFavorites(favorites.filter((fav) => fav.id !== id))
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  if (loading) {
    return <div className="favorites-loading">Loading favorites...</div>
  }

  if (!user) {
    return (
      <div className="favorites-login-prompt">
        <p>Sign in to save your favorite countries</p>
      </div>
    )
  }

  return (
    <div className="favorites-container">
      <h3 className="favorites-title">Your Favorite Countries</h3>

      {favorites.length === 0 ? (
        <p className="no-favorites">You haven't added any favorites yet.</p>
      ) : (
        <ul className="favorites-list">
          {favorites.map((favorite) => (
            <li key={favorite.id} className="favorite-item">
              <span className="favorite-name">{favorite.country_name}</span>
              <button onClick={() => removeFavorite(favorite.id)} className="remove-favorite">
                <i className="fas fa-times"></i>
              </button>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .favorites-container {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          width: 100%;
        }
        
        .favorites-title {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #1a73e8;
          font-size: 1.2rem;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 0.5rem;
        }
        
        .no-favorites {
          color: #666;
          font-style: italic;
        }
        
        .favorites-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .favorite-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .favorite-item:last-child {
          border-bottom: none;
        }
        
        .favorite-name {
          font-weight: 500;
        }
        
        .remove-favorite {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          transition: color 0.3s;
          padding: 5px;
        }
        
        .remove-favorite:hover {
          color: #e53e3e;
        }
        
        .favorites-loading {
          padding: 1rem;
          text-align: center;
          color: #666;
        }
        
        .favorites-login-prompt {
          padding: 1rem;
          text-align: center;
          color: #666;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

