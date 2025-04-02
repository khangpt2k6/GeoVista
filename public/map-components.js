// This file will be included in the map.html to add authentication functionality

document.addEventListener("DOMContentLoaded", async () => {
  // Load Supabase client
  const { createClient } = supabaseJs
  const supabaseUrl = "https://nynturihjmfguvwpjilr.supabase.co"
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bnR1cmloam1mZ3V2d3BqaWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MzgxNTIsImV4cCI6MjA1OTExNDE1Mn0.nqHohz-OWQUo_64CKx5OdEtIxP11CfTqTz6vSOO62wo"
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Create container for user profile
  const userProfileContainer = document.createElement("div")
  userProfileContainer.id = "user-profile-container"
  userProfileContainer.style.position = "fixed"
  userProfileContainer.style.top = "20px"
  userProfileContainer.style.right = "20px"
  userProfileContainer.style.zIndex = "1000"
  document.body.appendChild(userProfileContainer)

  // Create container for favorites
  const favoritesContainer = document.createElement("div")
  favoritesContainer.id = "favorites-container"
  favoritesContainer.style.position = "fixed"
  favoritesContainer.style.top = "80px"
  favoritesContainer.style.right = "20px"
  favoritesContainer.style.zIndex = "1000"
  favoritesContainer.style.width = "250px"
  document.body.appendChild(favoritesContainer)

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Render user profile
  renderUserProfile(user)

  // Render favorites
  if (user) {
    renderFavorites(user.id)

    // Add favorite button to country info
    const infoPanel = document.getElementById("info")
    const favoriteButton = document.createElement("button")
    favoriteButton.id = "favorite-button"
    favoriteButton.innerHTML = '<i class="far fa-heart"></i> Add to Favorites'
    favoriteButton.style.display = "none"
    favoriteButton.classList.add("favorite-button")
    infoPanel.appendChild(favoriteButton)

    // Style for favorite button
    const style = document.createElement("style")
    style.textContent = `
      .favorite-button {
        background: white;
        border: 1px solid #1a73e8;
        color: #1a73e8;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        margin-top: 15px;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .favorite-button:hover {
        background: #1a73e8;
        color: white;
      }
      .favorite-button.favorited {
        background: #1a73e8;
        color: white;
      }
      .favorite-button.favorited i {
        font-weight: 900;
      }
    `
    document.head.appendChild(style)

    // Handle favorite button click
    let currentCountry = null

    // Listen for country selection
    document.addEventListener("countrySelected", (e) => {
      currentCountry = e.detail
      favoriteButton.style.display = "flex"

      // Check if country is already favorited
      checkIfFavorited(user.id, currentCountry.name)
    })

    favoriteButton.addEventListener("click", async () => {
      if (!currentCountry) return

      if (favoriteButton.classList.contains("favorited")) {
        // Remove from favorites
        const { data: favorite } = await supabase
          .from("user_favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("country_name", currentCountry.name)
          .single()

        if (favorite) {
          await supabase.from("user_favorites").delete().eq("id", favorite.id)

          favoriteButton.classList.remove("favorited")
          favoriteButton.innerHTML = '<i class="far fa-heart"></i> Add to Favorites'

          // Update favorites list
          renderFavorites(user.id)
        }
      } else {
        // Add to favorites
        await supabase.from("user_favorites").insert([
          {
            user_id: user.id,
            country_name: currentCountry.name,
            country_code: currentCountry.code,
          },
        ])

        favoriteButton.classList.add("favorited")
        favoriteButton.innerHTML = '<i class="fas fa-heart"></i> Favorited'

        // Update favorites list
        renderFavorites(user.id)
      }
    })
  }

  async function checkIfFavorited(userId, countryName) {
    const { data } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("country_name", countryName)

    if (data && data.length > 0) {
      favoriteButton.classList.add("favorited")
      favoriteButton.innerHTML = '<i class="fas fa-heart"></i> Favorited'
    } else {
      favoriteButton.classList.remove("favorited")
      favoriteButton.innerHTML = '<i class="far fa-heart"></i> Add to Favorites'
    }
  }

  function renderUserProfile(user) {
    const profileContainer = document.getElementById("user-profile-container")

    if (!user) {
      profileContainer.innerHTML = `
        <div class="user-profile-buttons">
          <a href="/auth/login" class="login-button">
            <i class="fas fa-sign-in-alt"></i> Sign In
          </a>
          <a href="/auth/signup" class="signup-button">
            <i class="fas fa-user-plus"></i> Sign Up
          </a>
        </div>
        <style>
          .user-profile-buttons {
            display: flex;
            gap: 10px;
          }
          .login-button, .signup-button {
            padding: 8px 16px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            transition: all 0.3s;
            text-decoration: none;
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
        </style>
      `
    } else {
      profileContainer.innerHTML = `
        <div class="user-profile">
          <div class="user-info">
            <div class="user-avatar">
              ${user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
            </div>
            <div class="user-details">
              <div class="user-name">${user.user_metadata?.full_name || "User"}</div>
              <div class="user-email">${user.email}</div>
            </div>
          </div>
          <button id="logout-button" class="logout-button">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
        <style>
          .user-profile {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 15px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
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
            font-size: 18px;
          }
          .user-name {
            font-weight: 600;
            color: #333;
          }
          .user-email {
            font-size: 14px;
            color: #666;
          }
          .logout-button {
            padding: 8px 16px;
            background: #f5f5f5;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s;
          }
          .logout-button:hover {
            background: #e0e0e0;
          }
        </style>
      `

      // Add logout functionality
      document.getElementById("logout-button").addEventListener("click", async () => {
        await supabase.auth.signOut()
        window.location.href = "/"
      })
    }
  }

  async function renderFavorites(userId) {
    const favoritesContainer = document.getElementById("favorites-container")

    if (!userId) {
      favoritesContainer.innerHTML = ""
      return
    }

    // Fetch favorites
    const { data: favorites, error } = await supabase
      .from("user_favorites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching favorites:", error)
      return
    }

    // Render favorites
    favoritesContainer.innerHTML = `
      <div class="favorites-widget">
        <h3 class="favorites-title">Your Favorite Countries</h3>
        ${
          favorites.length === 0
            ? '<p class="no-favorites">You haven\'t added any favorites yet.</p>'
            : `<ul class="favorites-list">
            ${favorites
              .map(
                (favorite) => `
              <li class="favorite-item" data-country="${favorite.country_name}">
                <span class="favorite-name">${favorite.country_name}</span>
                <button class="remove-favorite" data-id="${favorite.id}">
                  <i class="fas fa-times"></i>
                </button>
              </li>
            `,
              )
              .join("")}
          </ul>`
        }
      </div>
      <style>
        .favorites-widget {
          background: white;
          border-radius: 12px;
          padding: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          width: 100%;
        }
        .favorites-title {
          margin-top: 0;
          margin-bottom: 10px;
          color: #1a73e8;
          font-size: 16px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 8px;
        }
        .no-favorites {
          color: #666;
          font-style: italic;
          font-size: 14px;
        }
        .favorites-list {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 300px;
          overflow-y: auto;
        }
        .favorite-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
        }
        .favorite-item:hover {
          background-color: #f9f9f9;
        }
        .favorite-item:last-child {
          border-bottom: none;
        }
        .favorite-name {
          font-weight: 500;
          font-size: 14px;
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
      </style>
    `

    // Add event listeners for favorite items
    document.querySelectorAll(".favorite-item").forEach((item) => {
      item.addEventListener("click", function (e) {
        if (!e.target.closest(".remove-favorite")) {
          const countryName = this.dataset.country
          // Trigger search for this country
          const searchBox = document.getElementById("searchBox")
          searchBox.value = countryName
          triggerSearch(countryName)
        }
      })
    })

    // Add event listeners for remove buttons
    document.querySelectorAll(".remove-favorite").forEach((button) => {
      button.addEventListener("click", async function (e) {
        e.stopPropagation()
        const id = this.dataset.id

        await supabase.from("user_favorites").delete().eq("id", id)

        // Update favorites list
        renderFavorites(userId)

        // Update favorite button if the current country is being unfavorited
        const currentCountryName = document.querySelector(".country-details h3")?.textContent
        if (currentCountryName && this.closest(".favorite-item").dataset.country === currentCountryName) {
          const favoriteButton = document.getElementById("favorite-button")
          if (favoriteButton) {
            favoriteButton.classList.remove("favorited")
            favoriteButton.innerHTML = '<i class="far fa-heart"></i> Add to Favorites'
          }
        }
      })
    })
  }
})

