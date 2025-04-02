import { createServerClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// Get user profile
export async function GET(request) {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get profile from database
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for "no rows returned"
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data || {} })
}

// Update user profile
export async function PUT(request) {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const updates = await request.json()

    // Validate input
    if (!updates) {
      return NextResponse.json({ error: "No update data provided" }, { status: 400 })
    }

    // Update profile
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: data[0],
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

