import { createServerClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request) {
  const supabase = createServerClient()
  await supabase.auth.signOut()

  return NextResponse.redirect(new URL("/", request.url))
}

