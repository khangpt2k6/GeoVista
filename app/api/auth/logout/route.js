import { cookies } from "next/headers"

export async function POST() {
  // Clear the authentication cookie
  cookies().delete("auth_token")

  return Response.json({
    success: true,
    message: "Logged out successfully",
  })
}

