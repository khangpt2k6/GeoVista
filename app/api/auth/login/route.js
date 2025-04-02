import { cookies } from "next/headers"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // In a real application, you would validate credentials against a database
    // This is a simplified example for demonstration purposes

    // Check if email exists and password is correct (mock validation)
    if (email === "demo@example.com" && password === "password123") {
      // Set a cookie to maintain session
      cookies().set("auth_token", "mock_token_12345", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      return Response.json({
        success: true,
        message: "Login successful",
      })
    }

    // If credentials are invalid
    return Response.json({ success: false, message: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ success: false, message: "An error occurred during login" }, { status: 500 })
  }
}

