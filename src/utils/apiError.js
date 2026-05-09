export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.success = false
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
