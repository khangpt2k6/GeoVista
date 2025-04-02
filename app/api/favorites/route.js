import { createServerClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// Get user's favorite countries
export async function GET(request) {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get favorites from database
  const { data, error } = await supabase.from("user_favorites").select("*").eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ favorites: data })
}

// Add a country to favorites
export async function POST(request) {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { countryName, countryCode } = await request.json()

    // Validate input
    if (!countryName) {
      return NextResponse.json({ error: "Country name is required" }, { status: 400 })
    }

    // Check if already favorited
    const { data: existingFavorite } = await supabase
      .from("user_favorites")
      .select("*")
      .eq("user_id", user.id)
      .eq("country_name", countryName)
      .single()

    if (existingFavorite) {
      return NextResponse.json({ message: "Country already in favorites" })
    }

    // Add to favorites
    const { data, error } = await supabase
      .from("user_favorites")
      .insert([
        {
          user_id: user.id,
          country_name: countryName,
          country_code: countryCode,
        },
      ])
      .select()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      message: "Country added to favorites",
      favorite: data[0],
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Remove a country from favorites
export async function DELETE(request) {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const favoriteId = searchParams.get("id")

    if (!favoriteId) {
      return NextResponse.json({ error: "Favorite ID is required" }, { status: 400 })
    }

    // Delete from favorites
    const { error } = await supabase.from("user_favorites").delete().eq("id", favoriteId).eq("user_id", user.id)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ message: "Country removed from favorites" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

