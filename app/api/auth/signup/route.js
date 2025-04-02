export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // In a real application, you would:
    // 1. Validate the input data
    // 2. Check if the email already exists in the database
    // 3. Hash the password
    // 4. Store the user in the database

    // This is a simplified example for demonstration purposes

    // Mock validation
    if (!name || !email || !password) {
      return Response.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    // Mock email validation
    if (!email.includes("@")) {
      return Response.json({ success: false, message: "Invalid email format" }, { status: 400 })
    }

    // Mock password validation
    if (password.length < 6) {
      return Response.json({ success: false, message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Mock successful registration
    return Response.json({
      success: true,
      message: "Account created successfully",
      user: { name, email },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return Response.json({ success: false, message: "An error occurred during registration" }, { status: 500 })
  }
}

