"use client";

import { useEffect, useState } from "react"; // Add useState here
import Link from "next/link";
import { supabase } from '@/utils/supabase/client';
import UserProfile from '@/components/user-profile';

export default function ExplorePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
      
      // If user is logged in, we can save this visit to history
      if (user) {
        const { error } = await supabase
          .from('user_history')
          .insert([
            { 
              user_id: user.id, 
              action: 'map_visit',
              details: 'Visited the world map'
            }
          ]);
          
        if (error) console.error('Error saving visit history:', error);
      }
      
      // Redirect to map page with correct path
      window.location.href = '/map.html';
    };

    checkUser();
  }, []);

  return (
    <div className="loading-container">
      <div className="user-profile-container">
        <UserProfile />
      </div>

      <div className="loading-content">
        <div className="loading-spinner"></div>
        <h2>Loading Map...</h2>
        <p>Please wait while we prepare your exploration experience.</p>
        <Link href="/" className="back-link">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
      </div>

      <style jsx>{`
        .loading-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(26, 115, 232, 0.1), rgba(123, 44, 191, 0.1));
          padding: 2rem;
        }
        
        .user-profile-container {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 100;
        }
        
        .loading-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 3rem;
          text-align: center;
          max-width: 500px;
        }
        
        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 5px solid rgba(26, 115, 232, 0.2);
          border-radius: 50%;
          border-top-color: #1a73e8;
          margin: 0 auto 2rem;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        h2 {
          color: #1a73e8;
          margin-bottom: 1rem;
        }
        
        p {
          color: #666;
          margin-bottom: 2rem;
        }
        
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #1a73e8;
          font-weight: 600;
          transition: color 0.3s;
        }
        
        .back-link:hover {
          color: #7b2cbf;
        }
      `}</style>
    </div>
  )
}

