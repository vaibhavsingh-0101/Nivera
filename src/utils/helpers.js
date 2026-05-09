export class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.success = statusCode < 400
    this.statusCode = statusCode
    this.data = data
    this.message = message
  }
}

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}