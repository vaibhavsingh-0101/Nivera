export const errorMiddleware = (err, req, res, next) => {
<<<<<<< HEAD
  console.error("ERROR:", err.message)

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(409).json({
      success: false,
      message: `${field} already exists`
    })
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      success: false,
      message: messages.join(", ")
    })
  }
=======
  console.error("ERROR:", err)
>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  })
<<<<<<< HEAD
}
=======
}
>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
